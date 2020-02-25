### Excel Converter (C# & TS)
----------------------
将Excel配置表转化成C#单例数据的转换器  
或者转换成ts全部变量，带类型

> 基本思路
> xlsx  meta -> Json Schema -> Code Generator
> xlsx data -> Singleton class

#### usage
```
> npm install
# 转换单文件
> ts-node main.ts -f ./j建筑信息表.xlsx -o ./output -t ts

# 批量
> ts-node main.ts -d ./ -o ./output/ -t ts
```


##### options
`-t, --type` 选择输出的文件类型, 可选`cs`, `ts`两种  
`-f, --file` 指定具体文件转化
`-d, --dir` 递归遍历文件下所有xlsx文件，转化至
`-o, --output` 指定输出文件夹，默认为当前目录
