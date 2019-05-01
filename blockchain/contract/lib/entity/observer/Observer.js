'use strict';

const State = require('../../api/state.js')

/**
 * @param {String} id observer unique id
 * @param {String} username observer username
 * @param {String} observer observer observer
 */
class Observer extends State {

    constructor(obj) {
        super(Observer.getClass(), [obj.username, obj.id]);
        Object.assign(this, obj);
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    getObserver() {
        return this.name;
    }

    setObserver(name) {
        this.name = name;
    }

    static fromBuffer(buffer) {
        return Observer.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state observer to observer
     * @param {Buffer} observer to form back into the object
     */
    static deserialize(observer) {
        return State.deserializeClass(observer, Observer);
    }

    /**
     * Factory method to create a observer object
     */
    static createInstance(username, id) {
        return new Observer({username, id});
    }

    static getClass() {
        return 'observercontract';
    }
}

module.exports = Observer;
