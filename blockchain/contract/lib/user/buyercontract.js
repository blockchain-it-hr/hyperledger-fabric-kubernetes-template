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
     * @param {String} id buyer unique id
     * @param {String} username buyer username
     */
    async createBuyer(ctx, id, username) {
        console.info('============= START : Create Buyer ===========');
        let buyer = Buyer.createInstance(id, username);
        await ctx.buyerList.addBuyer(buyer);
        console.info(Buffer.from(JSON.stringify(buyer)));
        console.info('============= END : Create Buyer ===========');
        return buyer.toBuffer();
    }

    /**
     * Update buyer
     *
     * @param {Context} ctx the context
     * @param {String} id buyer unique id
     * @param {String} username buyer username
     */
    async updateBuyer(ctx, id, username) {
        console.info('============= START : Update Buyer ===========');
        let buyerKey = Buyer.makeKey([username, id]);
        let buyer = await ctx.buyerList.getBuyer(buyerKey);
        if (!buyer.getUsername()) {
            return `Buyer with id: ${id} cannot be updated because it does not exist!`;
        }
        await ctx.buyerList.updateBuyer(buyer);
        console.info('============= END : Update Buyer ===========');
        return buyer.toBuffer();
    }

    /**
     * Query buyer
     *
     * @param {Context} ctx the context
     * @param {String} id buyer unique id
     * @param {String} username buyer username
     */
    async queryBuyer(ctx, id, username) {
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
}

module.exports = BuyerContract;
