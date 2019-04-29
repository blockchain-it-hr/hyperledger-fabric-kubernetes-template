'use strict';

const StateList = require('../../api/statelist.js');
const AccessToken = require('./AccessToken.js');

class AccessTokenList extends StateList {

    constructor(ctx) {
        super(ctx, 'accesstokencontractlist');
        this.use(AccessToken);
    }

    async addAccessToken(accessToken) {
        return this.addState(accessToken);
    }

    async getAccessToken(accessTokenKey) {
        return this.getState(accessTokenKey);
    }

    async getAccessTokenHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getAccessTokenQueryResult(query){
        return this.getQueryResult(query);
    }

    async updateAccessToken(accessToken) {
        return this.updateState(accessToken);
    }
}

module.exports = AccessTokenList;
