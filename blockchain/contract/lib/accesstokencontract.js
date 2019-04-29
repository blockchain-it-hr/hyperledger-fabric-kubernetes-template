'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Asset = require('../entity/asset/asset.js');
const AssetList = require('../entity/asset/assetlist.js');


class AccessTokenContext extends Context {
    constructor() {
        super();
        this.accesstokenList = new AssetList(this);
    }
}

class AccessTokenContract extends Contract {
    constructor() {
        super('accesstokencontract');
    }

    createContext() {
        return new AccessTokenContext();
    }

    async instantiate(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        //TODO: add seed accesstoken
        console.info('============= END : Initialize Ledger ===========');
    }

    async unknownTransaction(ctx) {
        throw new Error('Unkown transaction');
    }

    /**
     * Create accesstoken
     *
     * @param {Context} ctx the context
     * @param {String} id accesstoken unique id
     * @param {String} username accesstoken username
     */
    async createAccessToken(ctx, id, username) {
        console.info('============= START : Create AccessToken ===========');

        let asset = Asset.createInstance(id, username);
        asset.setCreated();
        await ctx.assetList.addAsset(asset);

        console.info(asset);
        console.info(Buffer.from(JSON.stringify(asset)));

        console.info('============= END : Create AccessToken ===========');
        return asset.toBuffer();
    }

    /**
     * Update accesstoken
     *
     * @param {Context} ctx the context
     * @param {String} id accesstoken unique id
     * @param {String} username accesstoken username
     */
    async updateAccessToken(ctx, id, username) {
        console.info('============= START : Update AccessToken ===========');

        let assetKey = Asset.makeKey([username, id]);
        let asset = await ctx.assetList.getAsset(assetKey);
        if (!asset.getUsername()) {
            return `AccessToken with id: ${id} cannot be updated because it does not exist!`;
        }

        await ctx.assetList.updateAsset(asset);
        console.info('============= END : Update AccessToken ===========');

        return asset.toBuffer();
    }

    /**
     * Query accesstoken
     *
     * @param {Context} ctx the context
     * @param {String} id accesstoken unique id
     * @param {String} username accesstoken username
     */
    async queryAccessToken(ctx, id, username) {
        console.info('============= START : Query AccessToken ===========');

        console.info(username + ":" + id);
        let assetKey = Asset.makeKey([name, id]);
        const asset = await ctx.assetList.getAsset(assetKey);
        console.log("AccessToken in query: " + asset.toBuffer());
        let bufferedAsset = asset.toBuffer();
        if (!bufferedAsset || bufferedAsset.length === 0) {
            return `AccessToken with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query AccessToken ===========');
        return asset.toBuffer();
    }
}

module.exports = AccessTokenContract;
