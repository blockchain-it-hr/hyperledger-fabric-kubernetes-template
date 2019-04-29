'use strict';

const State = require('../../api/state.js');

/**
 * @param {String} id buyer unique id
 * @param {String} owner buyer owner
 * @param {String} data buyer data
 */
class Buyer extends State {

    constructor(obj) {
        super(Buyer.getClass(), [obj.owner, obj.id]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getData(){
        return this.name;
    }

    setData(name){
        this.name = name;
    }

    static fromBuffer(buffer) {
        return Buyer.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to buyer
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        console.log('Data for deserialization: ' + data);
        return State.deserializeClass(data, Buyer);
    }

    /**
     * Factory method to create a buyer object
     */
    static createInstance(owner, id, name, category, issueDateTime, expirationDateTime, cost, description) {
        return new Buyer({owner, id, name, category, issueDateTime, expirationDateTime, cost, description});
    }

    static getClass() {
        return 'buyercontract';
    }
}

module.exports = Buyer;
