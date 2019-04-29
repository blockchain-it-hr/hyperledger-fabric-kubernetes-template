'use strict';

const State = require('../../api/state.js')

/**
 * @param {String} id data unique id
 * @param {String} owner data owner
 * @param {String} data data data
 */
class Data extends State {

    constructor(obj) {
        super(Data.getClass(), [obj.owner, obj.id]);
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
        return Data.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to data
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        console.log('Data for deserialization: ' + data);
        return State.deserializeClass(data, Data);
    }

    /**
     * Factory method to create a data object
     */
    static createInstance(owner, id, name, category, issueDateTime, expirationDateTime, cost, description) {
        return new Data({owner, id, name, category, issueDateTime, expirationDateTime, cost, description});
    }

    static getClass() {
        return 'datacontract';
    }
}

module.exports = Data;
