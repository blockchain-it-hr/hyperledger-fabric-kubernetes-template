/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const AccessTokens = require('./lib/AccessTokenContract');
const Data = require('./lib/DataContract');
const Buyers = require('./lib/user/BuyerContract');
const Sellers = require('./lib/user/SellerContract');
const Observers = require('./lib/user/ObserverContract');
const Users = require('./lib/UserContract');

module.exports.AccessTokens = AccessTokens;
module.exports.Data = Data;
module.exports.Buyers = Buyers;
module.exports.Sellers = Sellers;
module.exports.Observers = Observers;
module.exports.Users = Users;
module.exports.contracts = [ AccessTokens, Data, Buyers, Sellers, Observers, Users ];
