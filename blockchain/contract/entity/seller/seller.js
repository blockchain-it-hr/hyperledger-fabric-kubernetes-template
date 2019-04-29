'use strict';

const State = require('../../api/state.js')

/**
 * @param {String} id seller unique id
 * @param {String} owner seller owner
 * @param {String} seller seller seller
 */
class Seller extends State {

    constructor(obj) {
        super(Seller.getClass(), [obj.owner, obj.id]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getSeller(){
        return this.name;
    }

    setSeller(name){
        this.name = name;
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
        console.log('Seller for deserialization: ' + seller);
        return State.deserializeClass(seller, Seller);
    }

    /**
     * Factory method to create a seller object
     */
    static createInstance(owner, id, name, category, issueDateTime, expirationDateTime, cost, description) {
        return new Seller({owner, id, name, category, issueDateTime, expirationDateTime, cost, description});
    }

    static getClass() {
        return 'sellercontract';
    }
}

module.exports = Seller;
