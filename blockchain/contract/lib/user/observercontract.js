'use strict';
const {Contract, Context} = require('fabric-contract-api');

const Observer = require('../../entity/observer/observer.js');
const ObserverList = require('../../entity/observer/observerlist.js');


class ObserverContext extends Context {
    constructor() {
        super();
        this.observerList = new ObserverList(this);
    }
}

class ObserverContract extends Contract {
    constructor() {
        super('observercontract');
    }

    createContext() {
        return new ObserverContext();
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
     * Create observer
     *
     * @param {Context} ctx the context
     * @param {String} id observer unique id
     * @param {String} username observer username
     */
    async createObserver(ctx, id, username) {
        console.info('============= START : Create Observer ===========');
        let observer = Observer.createInstance(id, username);
        await ctx.observerList.addObserver(observer);
        console.info(Buffer.from(JSON.stringify(observer)));
        console.info('============= END : Create Observer ===========');
        return observer.toBuffer();
    }

    /**
     * Update observer
     *
     * @param {Context} ctx the context
     * @param {String} id observer unique id
     * @param {String} username observer username
     */
    async updateObserver(ctx, id, username) {
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

    /**
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

}

module.exports = ObserverContract;
