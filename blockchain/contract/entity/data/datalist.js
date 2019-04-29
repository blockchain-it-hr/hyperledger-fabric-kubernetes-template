'use strict';

const StateList = require('../../api/statelist.js');
const Data = require('./data.js');

class DataList extends StateList {

    constructor(ctx) {
        super(ctx, 'datacontractlist');
        this.use(Data);
    }

    async addData(data) {
        return this.addState(data);
    }

    async getData(dataKey) {
        return this.getState(dataKey);
    }

    async getDataHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getDataQueryResult(query){
        return this.getQueryResult(query);
    }

    async updateData(data) {
        return this.updateState(data);
    }
}

module.exports = DataList;
