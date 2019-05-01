'use strict';

const State = require('../../api/state.js');

/**
 * @param {String} id accessToken unique id
 * @param {String} owner accessToken owner
 * @param {String} data accessToken data
 */
class AccessToken extends State {

    constructor(obj) {
        super(AccessToken.getClass(), [obj.username, obj.id]);
        Object.assign(this, obj);
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    getToken() {
        return this.token;
    }

    setToken(newToken) {
        this.token = newToken;
    }

    static fromBuffer(buffer) {
        return AccessToken.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to accessToken
     * @param {Buffer} accessToken to form back into the object
     */
    static deserialize(accessToken) {
        return State.deserializeClass(accessToken, AccessToken);
    }

    /**
     * Factory method to create a accessToken object
     */
    static createInstance(username, id, token) {
        return new AccessToken({username, id, token});
    }

    static getClass() {
        return 'accesstokencontract';
    }
}

module.exports = AccessToken;
