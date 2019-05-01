'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Asset = require('./entity/asset/Asset.js');
const AssetList = require('./entity/asset/AssetList.js');

class AssetContext extends Context {
    constructor() {
        super();
        this.assetList = new AssetList(this);
    }
}

class AssetContract extends Contract {

    constructor() {
        super('assetcontract');
    }

    /**
     * Define a custom context for asset
     */
    createContext() {
        return new AssetContext();
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
     * Create asset
     *
     * @param {Context} ctx the asset context
     * @param {Integer} id asset unique id
     * @param {String} owner asset owner
     * @param {String} name asset name
     * @param {String} category asset category
     * @param {String} issueDateTime asset issue date
     * @param {String} expirationDateTime asset expiration date
     * @param {Integer} cost cost value of asset
     * @param {String} description
     * @param {Integer} quantity
     */
    async createAsset(ctx, owner, id, name, category, issueDateTime, expirationDateTime, cost, description, quantity) {
        console.info('============= START : Create Asset ===========');

        let asset = Asset.createInstance(owner, id, name, category, issueDateTime, expirationDateTime, cost, description, quantity);
        asset.setCreated();
        await ctx.assetList.addAsset(asset);

        console.info(asset);
        console.info(Buffer.from(JSON.stringify(asset)));

        console.info('============= END : Create Asset ===========');
        return asset.toBuffer();
    }

    //Working
    /**
     * Update asset
     *
     * @param {Context} ctx the asset context
     * @param {Integer} id asset unique id
     * @param {String} owner asset owner
     * @param {String} name asset name
     * @param {String} issueDateTime asset issue date
     * @param {String} expirationDateTime asset expiration date
     * @param {Integer} cost cost value of asset
     * @param {String} description
     * @param {String} state different states of asset
     * @param {Integer} quantity
     */

    /*
    CREATED: 1,
        PROCESSING: 2,
        TRANSPORTING: 3,
        IN_STORE: 4,
        SOLD: 5,
        REVOKED: 6 
    */
    async updateAsset(ctx, id, newOwner, name, category, issueDateTime, expirationDateTime, cost, description, state, quantity) {
        console.info('============= START : Update Asset ===========');

        let assetKey = Asset.makeKey([name, id]);
        console.info(assetKey);
        let asset = await ctx.assetList.getAsset(assetKey);
        //console.info(Asset.fromBuffer(asset));
        if (!asset.getName()) {
            return `Asset with id: ${id} cannot be updated because it does not exist!`;
        }

        /*
        if(asset.getOwner() !== owner){
            throw new Error(`Asset with id: ${id} cannot be updated because owner is not the same!`);
        }
        */

        if (newOwner && newOwner.length !== 0) {
            asset.owner = newOwner;
        }
        if (name && name.length !== 0) {
            asset.name = name;
        }
        if (cost && cost.length !== 0) {
            asset.cost = cost;
        }
        if (description && description.length !== 0) {
            asset.description = description;
        }
        if (category && category.length !== 0) {
            asset.category = category;
        }
        if (issueDateTime && issueDateTime.length !== 0) {
            asset.issueDateTime = issueDateTime;
        }
        if (issueDateTime && issueDateTime.length !== 0) {
            asset.expirationDateTime = expirationDateTime;
        }
        if (quantity && quantity.length !== 0) {
            asset.quantity = quantity;
        }

        /*
        CREATED: 1,
        PROCESSING: 2,
        TRANSPORTING: 3,
        IN_STORE: 4,
        SOLD: 5,
        REVOKED: 6 
        */
        //Now iterate throught states
        if (state === 'PROCESSING') {
            asset.setProcessing();
        } else if (state === 'TRANSPORTING') {
            asset.setTransporting();
        } else if (state === 'IN_STORE') {
            asset.setInStore();
        } else if (state === 'SOLD') {
            asset.setSold();
        } else if (state === 'REVOKED') {
            asset.setRevoked();
        }

        console.log(asset);

        await ctx.assetList.updateAsset(asset);
        console.info('============= END : Update Asset ===========');

        return asset.toBuffer();
    }

    /**
     * Query asset
     *
     * @param {Context} ctx the asset context
     * @param {String} name
     * @param {String} id asset unique id
     */
    //TODO: check that only logged in user can access their own asset!
    async queryAsset(ctx, name, id) {
        console.info('============= START : Query Asset ===========');

        console.info(name + ":" + id);
        let assetKey = Asset.makeKey([name, id]);
        console.info(assetKey);
        const asset = await ctx.assetList.getAsset(assetKey);
        console.log("Asset in query: " + asset.toBuffer());
        let bufferedAsset = asset.toBuffer();
        if (!bufferedAsset || bufferedAsset.length === 0) {
            return `Asset with: ${id} and name: ${name} does not exist`;
        }
        console.info('============= END : Query Asset ===========');

        return asset.toBuffer();
    }


    /**
     * Get history for asset
     *
     * @param {Context} ctx the asset context
     * @param {String} name
     * @param {String} id asset unique id
     */
    async getHistoryForKey(ctx, name, id) {
        let assetKey = Asset.makeKey([name, id]);
        const iterator = await ctx.assetList.getAssetHistoryForKey(assetKey);

        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                jsonRes.key = res.value.key;
                try {
                    jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return Buffer.from(JSON.stringify(allResults));
            }
        }
    }

    /**
     * Query all assets
     *
     * @param {Context} ctx the asset context
     */
    async queryAllAssets(ctx, user) {
        console.info('============= START : Query All Assets ===========');

        let query = `{\"selector\":{\"owner\":\"${user}\"}}`;

        const iterator = await ctx.assetList.getAssetQueryResult(query);

        let assetList;
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                jsonRes.key = res.value.key;
                try {
                    jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                //console.info(Buffer.from(JSON.stringify(allResults)));
                assetList = Buffer.from(JSON.stringify(allResults));
                break;
            }
        }

        console.log(assetList.toString());
        console.info('============= END : Query All Assets ===========');
        return assetList;

        let jsonAssetList = [];
        for (let a in assetList) {
            //console.log(a);
            jsonAssetList.push(a);
        }
        return JSON.stringify(jsonAssetList);
    }

}

module.exports = AssetContract;
