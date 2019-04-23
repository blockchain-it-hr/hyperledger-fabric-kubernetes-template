'use strict';

const StateList = require('./../ledger-api/statelist.js');
const Asset = require('./asset.js')

class AssetList extends StateList {

    constructor(ctx) {
        super(ctx, 'assetcontractlist');
        this.use(Asset);
    }

    async addAsset(asset) {
        return this.addState(asset);
    }

    async getAsset(assetKey) {
        return this.getState(assetKey);
    }

    async getAssetHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getAssetQueryResult(query){
        return this.getQueryResult(query);
    }

    async deleteAssetState(key){
        return this.deleteState(key);
    }

    async updateAsset(asset) {
        return this.updateState(asset);
    }
}

module.exports = AssetList;
