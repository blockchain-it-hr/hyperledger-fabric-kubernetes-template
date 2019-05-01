'use strict';
const { Contract, Context } = require('fabric-contract-api');

const AccessToken = require('./entity/accesstoken/AccessToken.js');
const AccessTokenList = require('./entity/accesstoken/AccessTokenList.js');

class AccessTokenContext extends Context {
    constructor() {
        super();
        this.accessTokenList = new AccessTokenList(this);
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
    async createAccessToken(ctx, id, username, token) {
        console.info('============= START : Create AccessToken ===========');

        //TODO: update

        let accessToken = AccessToken.createInstance(id, username, token);
        await ctx.accessTokenList.addAccessToken(accessToken);
        console.info(Buffer.from(JSON.stringify(accessToken)));
        console.info('============= END : Create AccessToken ===========');
        return accessToken.toBuffer();
    }

    /**
     * Update AccessToken
     *
     * @param {Context} ctx the context
     * @param {String} id AccessToken unique id
     * @param {String} username AccessToken username
     */
    async updateAccessToken(ctx, id, username, token) {
        console.info('============= START : Update AccessToken ===========');
        let accessTokenKey = AccessToken.makeKey([username, id]);
        let accessToken = await ctx.accessTokenList.getAccessToken(accessTokenKey);
        if (!accessToken.getUsername()) {
            return `AccessToken with id: ${id} cannot be updated because it does not exist!`;
        }
        accessToken.setToken(token);
        await ctx.accessTokenList.updateAccessToken(accessToken);
        console.info('============= END : Update AccessToken ===========');
        return accessToken.toBuffer();
    }

    /**
     * Query AccessToken
     *
     * @param {Context} ctx the context
     * @param {String} id AccessToken unique id
     * @param {String} username AccessToken username
     */
    async queryAccessToken(ctx, id, username) {
        console.info('============= START : Query AccessToken ===========');

        console.info(username + ":" + id);
        let accessTokenKey = AccessToken.makeKey([name, id]);
        const accessToken = await ctx.accessTokenList.getAccessToken(accessTokenKey);
        let bufferedAccessToken = accessToken.toBuffer();
        if (!bufferedAccessToken || bufferedAccessToken.length === 0) {
            return `AccessToken with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query AccessToken ===========');
        return accessToken.toBuffer();
    }
}

module.exports = AccessTokenContract;
