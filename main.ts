import * as Commander from 'commander';
import * as Excel from 'exceljs';
import * as R from 'ramda';
import * as fs from "fs";
import * as path from "path";

async function convert(inputFile: string, outputDir: fs.PathLike) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(inputFile);

    // parser
    var className = getClassName(workbook);
    var ClassName = upperFirst(className);
    var schema = getSchema(workbook);
    var classes = genCSharpClass(ClassName, schema);
    var generatedXml = `<${className}>
    ${getXml(workbook, inputFile)}
</${className}>`;
    var result = genCSharpCode(className, generatedXml, classes);
    await write(outputDir + `${ClassName}Factory.cs`, result);
}



/**
 * GetClassName
 */
function getClassName(workbook) {
    const conf = workbook.getWorksheet('conf');
    if (conf == null) {
        console.error('[ERROR]: 缺少conf');
        return "ERRORCLASS";
    }
    var serverFileName: string = conf.getRow(2).getCell(1).value.toString();
    
    let index = serverFileName.indexOf('.');
    return serverFileName.substring(1, index);
}


function getSchema(workbook: Excel.Workbook) {
    const meta = workbook.getWorksheet('meta');
    if (meta == null) {
        console.error(`[ERROR]: 缺少meta`);
        return {};
    }
    var objectFieldName: string = "";
    var properties = {};
    R.range(2, meta.rowCount).map(i => meta.getRow(i)).filter(row => row.actualCellCount > 0).forEach(row => {
        var description = row.getCell(1).value as string;
        var fieldName = row.getCell(2).value as string;
        var type = row.getCell(3).value as string;
        var typeJson = {type, description};
        
        if (fieldName.startsWith("S:")) {
            var arr = fieldName.split(':');
            objectFieldName = arr[1];
            if (properties[objectFieldName]) {
                return;
            } else {
                properties[objectFieldName] = {"type": "array"};
                properties[objectFieldName]["items"] = {"type": "object", "properties": {}};
                properties[objectFieldName]["items"]["properties"][arr[2]] = typeJson;
            }
        } else if (fieldName.startsWith('E:')) {
            var arr = fieldName.split(':');
            properties[objectFieldName]["items"]["properties"][arr[1]] = typeJson;
            objectFieldName = "";
        } else if (objectFieldName != "") {
            properties[objectFieldName]["items"]["properties"][fieldName] = typeJson;
        } else {
            properties[fieldName] = typeJson;
        }
    });
    return properties;
}

function upperFirst(str: string): string {
    if (str == null || str == "") {
        return "";
    }
    return str.substring(0, 1).toLocaleUpperCase() + str.substring(1, str.length);
}

function genCSharpClass(className: string, schema: Object): string {
    var properties: string[] = [];
    var subClasses: string[] = [];

    R.forEachObjIndexed((value, key) => {
        if (value['type'] == 'array') {
            var subClassName = upperFirst(key);
            subClasses.push(genCSharpClass(subClassName, value['items']['properties']));
            properties.push(`\t[XmlArrayAttribute("${key}Array")]\n\tpublic ${subClassName}[] ${key}; `);
        } else {
            properties.push(`\tpublic ${value['type']} ${key}; // ${value['description']}`);
        }
    }, schema);

    var classStr = `
public class ${className} {
${properties.join('\n')}
}`;

    return R.append(classStr, subClasses).join('\n');
}

function genCSharpCode(className: string, generatedXml: string, classes: string) : string {
    var ClassName = upperFirst(className);
    var result = `    
using System;
using System.Xml;
using System.Xml.Serialization;
using System.IO;
using System.Text;

${classes}

[XmlRoot("${className}")]
public class ${ClassName}Factory {
    [XmlElement("data")]
    public ${ClassName}[] ${className}Array {get; set;}
    private static ${ClassName}Factory _instance;

    ${ClassName}Factory() {}

    const string configXML = @"
    ${generatedXml}
    ";

    public static ${ClassName}Factory Instance {
        get {
            if (_instance == null) {
                XmlSerializer xs = new XmlSerializer(typeof(${ClassName}Factory));
                MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(configXML));
                _instance = xs.Deserialize(ms) as ${ClassName}Factory;
            }
            return _instance;
        }
    }
}
    `
    return result;
}

function genTsTypes(className: string, schema: Object): string {
    var properties: string[] = [];
    var subTypes: string[] = [];

    R.forEachObjIndexed((value, key) => {
        if (value['type'] == 'array') {
            var subClassName = upperFirst(key);
            subTypes.push(genTsTypes(subClassName, value['items']['properties']));
            properties.push(`\t${key}: Array<${subClassName}>; `);
        } else {
            properties.push(`\t${key}: ${value['type']}; // ${value['description']}`);
        }
    }, schema);

    var typeStr = `
export type ${upperFirst(className)} = {
${properties.join('\n')}
}`;

    return R.append(typeStr, subTypes).join('\n');
}

// 生成xml， 原来的xml生成器有些问题
function getXml(workbook: Excel.Workbook, filename: string): string {
    const meta = workbook.getWorksheet('meta');
    const data = workbook.getWorksheet('data');
    var fieldNameArray = meta.getColumn(2).values.filter(x => x != "转换字段名" && x != "") as Array<string>;
    let fieldsCount = fieldNameArray.length;
    var dataStr = R.range(3, data.rowCount).map(i => data.getRow(i)).filter(row => row.actualCellCount > 0).map(row => {
        if (row.actualCellCount != fieldsCount) {
            console.error(`[ERROR]: ${filename}`);
            return;
        }
        var values = R.take(row.actualCellCount, R.drop(1, row.values as Excel.CellValue[]));
        var xmlStr = "<data>";
        var fieldFlag = ""; // 记录当前的数组
        var objectFlag = ""; // 记录是否在item
        R.range(0, fieldsCount).forEach(i => {
            var fn = fieldNameArray[i];
            var v = values[i];
            if (fn.startsWith('S:')) {
                var arr = fn.split(':');
                if (fieldFlag == "") {   // 记录是否新开的数组
                    fieldFlag = arr[1] + "Array";
                    xmlStr += `<${fieldFlag}>`
                }
                objectFlag = upperFirst(arr[1]);
                var arr = fn.split(":");
                xmlStr += `<${objectFlag}><${arr[2]}>${v}</${arr[2]}>`;
            } else if (fn.startsWith('E:')) {
                var arr = fn.split(":");
                xmlStr += `<${arr[1]}>${v}</${arr[1]}></${objectFlag}>`;
                objectFlag = "";
            } else {
                if (objectFlag != "") { // in item
                    xmlStr += `<${fn}>${v}</${fn}>`;
                } else {
                    if (fieldFlag != "") {
                        xmlStr += `</${fieldFlag}>`;
                        fieldFlag = "";
                    } 
                   xmlStr += `<${fn}>${v}</${fn}>`;
                }
            }
        });
        xmlStr += "</data>";
        return xmlStr;
    }).join('');
    return dataStr;
}


//////////////////////////////////////////////
//////////    参数解析         ///////////////
//////////////////////////////////////////////

const program = new Commander.Command();
program.version('v0.0.1');
program.option('-d, --dir <dirpath>');
program.option('-f, --file <filepath>');
program.option('-o, --output <dirpath>')

program.parse(process.argv);

if (!program['output']) {
    program['output'] = "./";
}


if (program['file']) {
    convert(program['file'], program['output']);
}

if (program['dir']) {
    stepByDir(program['dir'], async (filepath) => {
        if (filepath.endsWith('xlsx')) {
            try {
                await convert(filepath, program['output']);
            } catch (e) {
                console.error(filepath);
                console.error(e);
            }
        }
    });
}

//  写入文件

    export async function open(file: fs.PathLike, mode: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            fs.open(file, mode, (err, fd) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(fd);
            });
        });
    }


    export async function write(file: fs.PathLike, ...content: string[]) {
        const fd = await open(file, 'w');
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(fd, Buffer.from(content.join(''), "utf-8"), err => {
                if (err) {
                    reject(err);
                    return ;
                }
                resolve();
                fs.close(fd, () => {});
            });
        })
    }

    export function stepByDir(dir: string, func: (_: string) => void) {
        fs.readdir(dir, {withFileTypes: true}, (err, files) => {
            if (err) {
                throw err;
            }
            files.filter(file => file.isFile()).forEach(f => func(path.join(dir, f.name)));
            files.filter(file => file.isDirectory()).forEach((f) => {
                stepByDir(path.join(dir,  f.name), func);
            })
        });
    }