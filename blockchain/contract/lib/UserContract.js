'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Buyer = require('./entity/buyer/Buyer.js');
const Seller = require('./entity/seller/Seller.js');
const Observer = require('./entity/observer/Observer.js');
const BuyerList = require('./entity/buyer/BuyerList.js');
const SellerList = require('./entity/seller/SellerList.js');
const ObserverList = require('./entity/observer/ObserverList.js');


class UserContext extends Context {
    constructor() {
        super();
        this.buyerList = new BuyerList(this);
        this.sellerList = new SellerList(this);
        this.observerList = new ObserverList(this);
    }
}

class UserContract extends Contract {
    constructor() {
        super('usercontract');
    }

    createContext() {
        return new UserContext();
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
     * Create observer
     *
     * @param {Context} ctx the context
     * @param {String} id unique id
     * @param {String} username
     */
    async createObserver(ctx, id, username) {
        console.info('============= START : Create Observer ===========');

        let observer = Observer.createInstance(id, username);
        await ctx.observerList.addObserver(observer);

        console.info(Buffer.from(JSON.stringify(observer)));

        console.info('============= END : Create Observer ===========');
        return observer.toBuffer();
    }

    //--------------------------------------------------------------------

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
     * Update observer
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async updateBuyer(ctx, id, username) {
        console.info('============= START : Update Observer ===========');

        let observerKey = Observer.makeKey([username, id]);
        let observer = await ctx.observerList.getObserver(observerKey);
        if (!observer.getUsername()) {
            return `Observer with id: ${id} cannot be updated because it does not exist!`;
        }

        await ctx.observerList.updateObserver(observer);
        console.info('============= END : Update Observer ===========');

        return observer.toBuffer();
    }

    //--------------------------------------------------------------------

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
     * Query observer
     *
     * @param {Context} ctx the context
     * @param {String} id data unique id
     * @param {String} username data username
     */
    async getObserverByUsername(ctx, id, username) {
        console.info('============= START : Query Observer ===========');

        let observerKey = Observer.makeKey([username, id]);
        const observer = await ctx.observerList.getObserver(observerKey);
        let bufferedObserver = observer.toBuffer();
        if (!bufferedObserver || bufferedObserver.length === 0) {
            return `Observer with: ${id} and username: ${username} does not exist`;
        }
        console.info('============= END : Query Observer ===========');
        return observer.toBuffer();
    }

    //--------------------------------------------------------------------


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

    /**
     * Get all observers
     *
     * @param {Context} ctx the context
     */
    async getAllObservers(ctx) {
        console.info('============= START : Get All Observers ===========');
        console.log(Buffer.from(JSON.stringify(ctx.observerList)));
        console.info('============= END : Get All Observers ===========');
        return Buffer.from(JSON.stringify(ctx.observerList));
    }

    //--------------------------------------------------------------------


}

module.exports = UserContract;
