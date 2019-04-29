'use strict';

const State = require('../../api/state.js')

/**
 * @param {String} id observer unique id
 * @param {String} owner observer owner
 * @param {String} observer observer observer
 */
class Observer extends State {

    constructor(obj) {
        super(Observer.getClass(), [obj.owner, obj.id]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getObserver(){
        return this.name;
    }

    setObserver(name){
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
        console.log('Observer for deserialization: ' + observer);
        return State.deserializeClass(observer, Observer);
    }

    /**
     * Factory method to create a observer object
     */
    static createInstance(owner, id, name, category, issueDateTime, expirationDateTime, cost, description) {
        return new Observer({owner, id, name, category, issueDateTime, expirationDateTime, cost, description});
    }

    static getClass() {
        return 'observercontract';
    }
}

module.exports = Observer;
