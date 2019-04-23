'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Asset = require('./asset.js');
const AssetList = require('./assetlist.js');


class SellerContext extends Context {
    constructor() {
        super();
        this.sellerList = new AssetList(this);
    }
}

class SellerContract extends Contract {
    constructor() {
        super('sellercontract');
    }

    createContext() {
        return new SellerContext();
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
     * Create seller
     *
     * @param {Context} ctx the context
     * @param {String} id seller unique id
     * @param {String} username seller username
     */
    async createSeller(ctx, id, username) {
        console.info('============= START : Create Seller ===========');

        let asset = Asset.createInstance(id, username);
        asset.setCreated();
        await ctx.assetList.addAsset(asset);

        console.info(asset);
        console.info(Buffer.from(JSON.stringify(asset)));

        console.info('============= END : Create Seller ===========');
        return asset.toBuffer();
    }

    /**
     * Update seller
     *
     * @param {Context} ctx the context
     * @param {String} id seller unique id
     * @param {String} username seller username
     */
    async updateSeller(ctx, id, username) {
        console.info('============= START : Update Seller ===========');

        let assetKey = Asset.makeKey([username, id]);
        console.info(assetKey);
        let asset = await ctx.assetList.getAsset(assetKey);
        if (!asset.getUsername()) {
            return `Seller with id: ${id} cannot be updated because it does not exist!`;
        }

        await ctx.assetList.updateAsset(asset);
        console.info('============= END : Update Seller ===========');

        return asset.toBuffer();
    }

    /**
     * Query seller
     *
     * @param {Context} ctx the context
     * @param {String} id seller unique id
     * @param {String} username seller username
     */
    async querySeller(ctx, id, username) {
        console.info('============= START : Query Seller ===========');

        console.info(username + ":" + id);
        let assetKey = Asset.makeKey([name, id]);
        const asset = await ctx.assetList.getAsset(assetKey);
        console.log("Seller in query: " + asset.toBuffer());
        let bufferedAsset = asset.toBuffer();
        if (!bufferedAsset || bufferedAsset.length === 0) {
            return `Seller with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Seller ===========');
        return asset.toBuffer();
    }
}

module.exports = SellerContract;
