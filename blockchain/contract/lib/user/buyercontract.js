'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Buyer = require('../../entity/buyer/buyer.js');
const BuyerList = require('../../entity/buyer/buyerlist.js');


class BuyerContext extends Context {
    constructor() {
        super();
        this.buyerList = new BuyerList(this);
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
     * @param {String} username
     * @param {String} id unique id
     */
    async createBuyer(ctx, username, id) {
        console.info('============= START : Create Buyer ===========');
        let buyer = Buyer.createInstance(username, id);
        await ctx.buyerList.addBuyer(buyer);
        console.info(Buffer.from(JSON.stringify(buyer)));
        console.info('============= END : Create Buyer ===========');
        return buyer.toBuffer();
    }

    /**
     * Update buyer
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async updateBuyer(ctx, id, username) {
        console.info('============= START : Update Buyer ===========');
        let buyerKey = Buyer.makeKey([username, id]);
        let buyer = await ctx.buyerList.getBuyer(buyerKey);
        if (!buyer.getUsername()) {
            return `Buyer with id: ${id} cannot be updated because it does not exist!`;
        }
        await ctx.buyerList.updateBuyer(buyer);
        console.info('============= END : Update Data ===========');
        return buyer.toBuffer();
    }

    /**
     * Query buyer
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async getBuyerByUsername(ctx, id, username) {
        console.info('============= START : Query Buyer ===========');
        let buyerKey = Buyer.makeKey([username, id]);
        const buyer = await ctx.buyerList.getBuyer(buyerKey);
        let bufferedBuyer = buyer.toBuffer();
        if (!bufferedBuyer || bufferedBuyer.length === 0) {
            return `Buyer with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Buyer ===========');
        return buyer.toBuffer();
    }

    /**
     * Get all buyers
     *
     * @param {Context} ctx the context
     */
    async getAllBuyers(ctx) {
        console.info('============= START : Get All Buyers ===========');
        console.log(Buffer.from(JSON.stringify(ctx.buyerList)));
        console.info('============= END : Get All Buyers ===========');
        return Buffer.from(JSON.stringify(ctx.buyerList));
    }

}

module.exports = BuyerContract;
