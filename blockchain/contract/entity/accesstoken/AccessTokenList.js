'use strict';

const StateList = require('../../api/statelist.js');
const Buyer = require('./Buyer.js');

class BuyerList extends StateList {

    constructor(ctx) {
        super(ctx, 'accesstokencontractlist');
        this.use(Buyer);
    }

    async addBuyer(accessToken) {
        return this.addState(accessToken);
    }

    async getBuyer(accessTokenKey) {
        return this.getState(accessTokenKey);
    }

    async getBuyerHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getBuyerQueryResult(query){
        return this.getQueryResult(query);
    }

    async updateBuyer(accessToken) {
        return this.updateState(accessToken);
    }
}

module.exports = BuyerList;
