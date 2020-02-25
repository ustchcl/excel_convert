### Excel Converter (C#)
----------------------
将Excel配置表转化成C#单例数据的转换器

> 基本思路
> xlsx  meta -> Json Schema -> Code Generator
> xlsx data -> Singleton class

#### usage
```
> npm install
# 转换单文件
> ts-node main.ts -f ./j建筑信息表.xlsx -o ./output

# 批量
> ts-node main.ts -d ./ -o ./output/
```

#### TODO (Typescript)
生成ts版本