

export type Model = {
	id: number; // 造型
	levelRequire: number; // 要求等级
}

export type BulidInfo = {
	id: number; // 编号
	name: string; // 名称
	productCoefficient: string; // 产出系数
	timeCoefficient: string; // 时间系数
	time: string; // 时间间隔
	limitLevel: number; // 上限等级
	modelArray: Array<Model>; 
	description: string; // 描述
}

export let BulidInfoData: Array<BulidInfo> = [
    {"id":1,"name":"主基地","productCoefficient":"2.5","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 101,"levelRequire":1},{ "id": 102,"levelRequire":10},{ "id": 103,"levelRequire":25},{ "id": 104,"levelRequire":40},],"description":"这是一句描述",},{"id":2,"name":"兵工厂","productCoefficient":"1.2","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 201,"levelRequire":1},{ "id": 202,"levelRequire":10},{ "id": 203,"levelRequire":25},{ "id": 204,"levelRequire":40},],"description":"这是一句描述",},{"id":3,"name":"实验室","productCoefficient":"1.2","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 301,"levelRequire":1},{ "id": 302,"levelRequire":10},{ "id": 303,"levelRequire":25},{ "id": 304,"levelRequire":40},],"description":"这是一句描述",},{"id":4,"name":"矿场","productCoefficient":"1.2","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 401,"levelRequire":1},{ "id": 402,"levelRequire":10},{ "id": 403,"levelRequire":25},{ "id": 404,"levelRequire":40},],"description":"这是一句描述",},{"id":5,"name":"运输厂","productCoefficient":"1.2","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 501,"levelRequire":1},{ "id": 502,"levelRequire":10},{ "id": 503,"levelRequire":25},{ "id": 504,"levelRequire":40},],"description":"这是一句描述",},{"id":6,"name":"仓库1","productCoefficient":"0.9","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 601,"levelRequire":1},{ "id": 602,"levelRequire":10},{ "id": 603,"levelRequire":25},{ "id": 604,"levelRequire":40},],"description":"这是一句描述",},{"id":7,"name":"仓库2","productCoefficient":"0.9","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 601,"levelRequire":1},{ "id": 602,"levelRequire":10},{ "id": 603,"levelRequire":25},{ "id": 604,"levelRequire":40},],"description":"这是一句描述",},{"id":8,"name":"仓库3","productCoefficient":"0.9","timeCoefficient":"1","time":"5","limitLevel":50,"modelArray": [{ "id": 601,"levelRequire":1},{ "id": 602,"levelRequire":10},{ "id": 603,"levelRequire":25},{ "id": 604,"levelRequire":40},],"description":"这是一句描述",},{"id":9,"name":"回收场","productCoefficient":"0","timeCoefficient":"1","time":"0","limitLevel":1,"modelArray": [{ "id": 9,"levelRequire":1},{ "id": 9,"levelRequire":1},{ "id": 9,"levelRequire":1},{ "id": 9,"levelRequire":1},],"description":"这是一句描述",},{"id":10,"name":"商店","productCoefficient":"0","timeCoefficient":"1","time":"0","limitLevel":1,"modelArray": [{ "id": 10,"levelRequire":1},{ "id": 10,"levelRequire":1},{ "id": 10,"levelRequire":1},{ "id": 10,"levelRequire":1},],"description":"这是一句描述",},{"id":11,"name":"福利店","productCoefficient":"0","timeCoefficient":"1","time":"0","limitLevel":1,"modelArray": [{ "id": 11,"levelRequire":1},{ "id": 11,"levelRequire":1},{ "id": 11,"levelRequire":1},{ "id": 11,"levelRequire":1},],"description":"这是一句描述",}
    ]