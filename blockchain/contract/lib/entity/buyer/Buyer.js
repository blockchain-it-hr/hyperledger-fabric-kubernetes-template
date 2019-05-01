'use strict';

const State = require('../../api/state.js');

/**
 * @param {String} id buyer unique id
 * @param {String} owner buyer owner
 * @param {String} data buyer data
 */
class Buyer extends State {

    constructor(obj) {
        super(Buyer.getClass(), [obj.username, obj.id]);
        Object.assign(this, obj);
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    static fromBuffer(buffer) {
        return Buyer.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to buyer
     * @param {Buffer} buyer to form back into the object
     */
    static deserialize(buyer) {
        return State.deserializeClass(buyer, Buyer);
    }

    /**
     * Factory method to create a buyer object
     */
    static createInstance(username, id) {
        return new Buyer({username, id});
    }

    static getClass() {
        return 'buyercontract';
    }
}

module.exports = Buyer;
