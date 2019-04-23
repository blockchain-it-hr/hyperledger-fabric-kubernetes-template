'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Asset = require('./asset.js');
const AssetList = require('./assetlist.js');


class BuyerContext extends Context {
    constructor() {
        super();
        this.buyerList = new AssetList(this);
    }
}

class BuyerContract extends Contract {
    constructor() {
        super('buyercontract');
    }

    createContext() {
        return new BuyerContext();
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
     * Create buyer
     *
     * @param {Context} ctx the context
     * @param {String} id buyer unique id
     * @param {String} username buyer username
     */
    async createBuyer(ctx, id, username) {
        console.info('============= START : Create Buyer ===========');

        let asset = Asset.createInstance(id, username);
        asset.setCreated();
        await ctx.assetList.addAsset(asset);

        console.info(asset);
        console.info(Buffer.from(JSON.stringify(asset)));

        console.info('============= END : Create Buyer ===========');
        return asset.toBuffer();
    }

    /**
     * Update buyer
     *
     * @param {Context} ctx the context
     * @param {String} id buyer unique id
     * @param {String} username buyer username
     */
    async updateBuyer(ctx, id, username) {
        console.info('============= START : Update Buyer ===========');

        let assetKey = Asset.makeKey([username, id]);
        console.info(assetKey);
        let asset = await ctx.assetList.getAsset(assetKey);
        if (!asset.getUsername()) {
            return `Buyer with id: ${id} cannot be updated because it does not exist!`;
        }

        await ctx.assetList.updateAsset(asset);
        console.info('============= END : Update Buyer ===========');

        return asset.toBuffer();
    }

    /**
     * Query buyer
     *
     * @param {Context} ctx the context
     * @param {String} id buyer unique id
     * @param {String} username buyer username
     */
    async queryBuyer(ctx, id, username) {
        console.info('============= START : Query Buyer ===========');

        console.info(username + ":" + id);
        let assetKey = Asset.makeKey([name, id]);
        const asset = await ctx.assetList.getAsset(assetKey);
        console.log("Buyer in query: " + asset.toBuffer());
        let bufferedAsset = asset.toBuffer();
        if (!bufferedAsset || bufferedAsset.length === 0) {
            return `Buyer with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Buyer ===========');
        return asset.toBuffer();
    }
}

module.exports = BuyerContract;
