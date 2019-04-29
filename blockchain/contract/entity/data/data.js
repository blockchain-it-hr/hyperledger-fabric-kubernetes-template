'use strict';

const State = require('../../api/state.js');

/**
 * @param {String} id data unique id
 * @param {String} username data username
 * @param {String} data data data
 */
class Data extends State {

    constructor(obj) {
        super(Data.getClass(), [obj.username, obj.id]);
        Object.assign(this, obj);
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    getData() {
        return this.name;
    }

    setData(name) {
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
        return State.deserializeClass(data, Data);
    }

    /**
     * Factory method to create a data object
     */
    static createInstance(id, username, json) {
        return new Data({username, id, json});
    }

    static getClass() {
        return 'datacontract';
    }
}

module.exports = Data;
