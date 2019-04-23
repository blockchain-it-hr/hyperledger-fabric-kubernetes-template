'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Asset = require('./asset.js');
const AssetList = require('./assetlist.js');


class ObserverContext extends Context {
    constructor() {
        super();
        this.observerList = new AssetList(this);
    }
}

class ObserverContract extends Contract {
    constructor() {
        super('observercontract');
    }

    createContext() {
        return new ObserverContext();
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
     * Create observer
     *
     * @param {Context} ctx the context
     * @param {String} id observer unique id
     * @param {String} username observer username
     */
    async createObserver(ctx, id, username) {
        console.info('============= START : Create Observer ===========');

        let asset = Asset.createInstance(id, username);
        asset.setCreated();
        await ctx.assetList.addAsset(asset);

        console.info(asset);
        console.info(Buffer.from(JSON.stringify(asset)));

        console.info('============= END : Create Observer ===========');
        return asset.toBuffer();
    }

    /**
     * Update observer
     *
     * @param {Context} ctx the context
     * @param {String} id observer unique id
     * @param {String} username observer username
     */
    async updateObserver(ctx, id, username) {
        console.info('============= START : Update Observer ===========');

        let assetKey = Asset.makeKey([username, id]);
        console.info(assetKey);
        let asset = await ctx.assetList.getAsset(assetKey);
        if (!asset.getUsername()) {
            return `Observer with id: ${id} cannot be updated because it does not exist!`;
        }

        await ctx.assetList.updateAsset(asset);
        console.info('============= END : Update Observer ===========');

        return asset.toBuffer();
    }

    /**
     * Query observer
     *
     * @param {Context} ctx the context
     * @param {String} id observer unique id
     * @param {String} username observer username
     */
    async queryObserver(ctx, id, username) {
        console.info('============= START : Query Observer ===========');

        console.info(username + ":" + id);
        let assetKey = Asset.makeKey([name, id]);
        const asset = await ctx.assetList.getAsset(assetKey);
        console.log("Observer in query: " + asset.toBuffer());
        let bufferedAsset = asset.toBuffer();
        if (!bufferedAsset || bufferedAsset.length === 0) {
            return `Observer with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Observer ===========');
        return asset.toBuffer();
    }
}

module.exports = ObserverContract;
