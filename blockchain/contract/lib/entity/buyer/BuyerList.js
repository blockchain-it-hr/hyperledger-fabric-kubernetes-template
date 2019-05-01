'use strict';

const StateList = require('../../api/statelist.js');
const Buyer = require('./Buyer.js');

class BuyerList extends StateList {

    constructor(ctx) {
        super(ctx, 'buyercontractlist');
        this.use(Buyer);
    }

    async addBuyer(buyer) {
        return this.addState(buyer);
    }

    async getBuyer(buyerKey) {
        return this.getState(buyerKey);
    }

    async getBuyerHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getBuyerQueryResult(query){
        return this.getQueryResult(query);
    }

    async updateBuyer(buyer) {
        return this.updateState(buyer);
    }
}

module.exports = BuyerList;
