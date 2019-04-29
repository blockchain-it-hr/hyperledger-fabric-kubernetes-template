'use strict';

const StateList = require('../../api/statelist.js');
const Seller = require('./Seller.js');

class SellerList extends StateList {

    constructor(ctx) {
        super(ctx, 'sellercontractlist');
        this.use(Seller);
    }

    async addSeller(seller) {
        return this.addState(seller);
    }

    async getSeller(sellerKey) {
        return this.getState(sellerKey);
    }

    async getSellerHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getSellerQueryResult(query){
        return this.getQueryResult(query);
    }

    async updateSeller(seller) {
        return this.updateState(seller);
    }
}

module.exports = SellerList;
