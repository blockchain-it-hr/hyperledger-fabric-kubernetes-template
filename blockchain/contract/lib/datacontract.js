'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Data = require('../entity/data/data.js');
const DataList = require('../entity/data/datalist.js');


class DataContext extends Context {
    constructor() {
        super();
        this.dataList = new DataList(this);
    }
}

class DataContract extends Contract {
    constructor() {
        super('datacontract');
    }

    createContext() {
        return new DataContext();
    }

    async instantiate(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        //TODO: add seed data
        console.info('============= END : Initialize Ledger ===========');
    }

    async unknownTransaction(ctx) {
        throw new Error('Unkown transaction');
    }

    /**
     * Create data
     *
     * @param {Context} ctx the context
     * @param {String} id unique id
     * @param {String} username
     * @param {String} json data
     */
    async createData(ctx, id, username, json) {
        console.info('============= START : Create Data ===========');

        let data = Data.createInstance(id, username, json);
        data.setCreated();
        await ctx.dataList.addData(data);

        console.info(data);
        console.info(Buffer.from(JSON.stringify(data)));

        console.info('============= END : Create Data ===========');
        return data.toBuffer();
    }

    /**
     * Update data
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     * @param {String} json data
     */
    async updateData(ctx, id, username, json) {
        console.info('============= START : Update Data ===========');

        let dataKey = Data.makeKey([username, id]);
        let data = await ctx.dataList.getData(dataKey);
        if (!data.getUsername()) {
            return `Data with id: ${id} cannot be updated because it does not exist!`;
        }

        data.setJson(json);

        await ctx.dataList.updateData(data);
        console.info('============= END : Update Data ===========');

        return data.toBuffer();
    }

    /**
     * Query data
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async queryData(ctx, id, username) {
        console.info('============= START : Query Data ===========');

        let dataKey = Data.makeKey([username, id]);
        const data = await ctx.dataList.getData(dataKey);
        let bufferedData = data.toBuffer();
        if (!bufferedData || bufferedData.length === 0) {
            return `Data with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Data ===========');
        return data.toBuffer();
    }
}

module.exports = DataContract;
