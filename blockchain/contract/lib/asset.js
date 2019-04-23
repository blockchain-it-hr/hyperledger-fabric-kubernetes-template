'use strict'

const State = require('./../ledger-api/state.js')

const assetState = {
    CREATED: 1,
    PROCESSING: 2,
    TRANSPORTING: 3,
    IN_STORE: 4,
    SOLD: 5,
    REVOKED: 6 // if expiration has happened or it has been damaged
};


/**
* @param {Integer} id asset unique id
* @param {String} owner asset owner
* @param {String} name asset name
* @param {String} category asset category
* @param {String} issueDateTime asset issue date
* @param {String} expirationDateTime asset expiration date
* @param {Integer} cost cost value of asset
* @param {String} description
* @param {Integer} quantity
*/
class Asset extends State {

    constructor(obj) {
        super(Asset.getClass(), [obj.name, obj.id]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }


    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    getCategory(){
        return this.category;
    }

    setCategory(newCategory){
        this.category = newCategory;
    }

    getIssueDateTime(){
        return this.issueDateTime;
    }

    setIssueDateTime(newIssueDateTime){
        this.issueDateTime = newIssueDateTime;
    }

    getExpirationDateTime(){
        return this.expirationDateTime;
    }

    setExpirationDateTime(newExpirationDateTime){
        this.expirationDateTime = newExpirationDateTime;
    }

    getCost(){
        return this.cost;
    }

    setCost(newCost){
        this.cost = newCost;
    }

    getDescription(){
        return this.description;
    }

    setDescription(newDescription){
        this.description = newDescription;
    }

    getQuantity(){
        return this.quantity;
    }

    setQuantity(newQuantity){
        this.quantity = newQuantity;
    }

    /**
     * Set states
     */

    setCreated() {
        this.currentState = assetState.CREATED;
    }

    isCreated() {
        return this.currentState === assetState.CREATED;
    }

    setProcessing() {
        this.currentState = assetState.PROCESSING;
    }

    isProcessing() {
        return this.currentState === assetState.PROCESSING;
    }

    setTransporting() {
        this.currentState = assetState.TRANSPORTING;
    }

    isTransporting() {
        return this.currentState === assetState.TRANSPORTING;
    }

    setInStore() {
        this.currentState = assetState.IN_STORE;
    }

    isInStore() {
        return this.currentState === assetState.IN_STORE;
    }

    setSold() {
        this.currentState = assetState.SOLD;
    }

    isSold() {
        return this.currentState === assetState.SOLD;
    }

    setRevoked() {
        this.currentState = assetState.REVOKED;
    }

    isRevoked() {
        return this.currentState === assetState.REVOKED;
    }

    static fromBuffer(buffer) {
        console.log('Buffer: ' + buffer);
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
