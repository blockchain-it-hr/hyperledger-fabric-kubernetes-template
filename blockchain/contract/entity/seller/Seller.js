'use strict';

const State = require('../../api/state.js')

/**
 * @param {String} id seller unique id
 * @param {String} username seller username
 * @param {String} seller seller seller
 */
class Seller extends State {

    constructor(obj) {
        super(Seller.getClass(), [obj.username, obj.id]);
        Object.assign(this, obj);
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    static fromBuffer(buffer) {
        return Seller.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state seller to seller
     * @param {Buffer} seller to form back into the object
     */
    static deserialize(seller) {
        return State.deserializeClass(seller, Seller);
    }

    /**
     * Factory method to create a seller object
     */
    static createInstance(username, id) {
        return new Seller({username, id});
    }

    static getClass() {
        return 'sellercontract';
    }
}

module.exports = Seller;
