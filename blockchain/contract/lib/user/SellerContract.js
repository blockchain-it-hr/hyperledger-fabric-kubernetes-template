'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Seller = require('../../entity/seller/Seller.js');
const SellerList = require('../../entity/seller/SellerList.js');


class SellerContext extends Context {
    constructor() {
        super();
        this.sellerList = new SellerList(this);
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
     * @param {String} id unique id
     * @param {String} username
     */
    async createSeller(ctx, id, username) {
        console.info('============= START : Create Seller ===========');
        let seller = Seller.createInstance(id, username);
        await ctx.sellerList.addSeller(seller);
        console.info(Buffer.from(JSON.stringify(seller)));
        console.info('============= END : Create Seller ===========');
        return seller.toBuffer();
    }

    /**
     * Update seller
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async updateSeller(ctx, id, username) {
        console.info('============= START : Update Seller ===========');
        let sellerKey = Seller.makeKey([username, id]);
        let seller = await ctx.sellerList.getSeller(sellerKey);
        if (!seller.getUsername()) {
            return `Seller with id: ${id} cannot be updated because it does not exist!`;
        }
        await ctx.sellerList.updateSeller(seller);
        console.info('============= END : Update Seller ===========');
        return seller.toBuffer();
    }


    /**
     * Query seller
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async getSellerByUsername(ctx, id, username) {
        console.info('============= START : Query Seller ===========');
        let sellerKey = Seller.makeKey([username, id]);
        const seller = await ctx.sellerList.getBuyer(sellerKey);
        let bufferedSeller = seller.toBuffer();
        if (!bufferedSeller || bufferedSeller.length === 0) {
            return `Seller with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Seller ===========');
        return seller.toBuffer();
    }


    /**
     * Get all sellers
     *
     * @param {Context} ctx the context
     */
    async getAllSellers(ctx) {
        console.info('============= START : Get All Sellers ===========');
        console.log(Buffer.from(JSON.stringify(ctx.sellerList)));
        console.info('============= END : Get All Sellers ===========');
        return Buffer.from(JSON.stringify(ctx.sellerList));
    }




}

module.exports = SellerContract;
