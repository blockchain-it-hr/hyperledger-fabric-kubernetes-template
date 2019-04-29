'use strict';

const StateList = require('../../api/statelist.js');
const Observer = require('./observer.js');

class ObserverList extends StateList {

    constructor(ctx) {
        super(ctx, 'observercontractlist');
        this.use(Observer);
    }

    async addObserver(observer) {
        return this.addState(observer);
    }

    async getObserver(observerKey) {
        return this.getState(observerKey);
    }

    async getObserverHistoryForKey(key){
        return this.getHistoryForKey(key);
    }

    async getObserverQueryResult(query){
        return this.getQueryResult(query);
    }

    async updateObserver(observer) {
        return this.updateState(observer);
    }
}

module.exports = ObserverList;
