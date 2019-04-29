'use strict'

const State = require('../../api/state.js')

/**
* @param {String} id asset unique id
* @param {String} owner asset owner
* @param {String} data asset data
*/
class Asset extends State {

    constructor(obj) {
        super(Asset.getClass(), [obj.owner, obj.id]);
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
        return Asset.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to asset
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        console.log('Data for deserialization: ' + data);
        return State.deserializeClass(data, Asset);
    }

    /**
     * Factory method to create a asset object
     */
    static createInstance(owner, id, name, category, issueDateTime, expirationDateTime, cost, description) {
        return new Asset({owner, id, name, category, issueDateTime, expirationDateTime, cost, description});
    }

    static getClass() {
        return 'assetcontract';
    }
}

module.exports = Asset;
