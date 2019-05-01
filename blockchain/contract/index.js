/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const DataContract = require('./lib/DataContract');

//const AccessToken = require('./lib/AccessTokenContract');
//const Data = require('./lib/DataContract');
//const Buyer = require('./lib/user/BuyerContract');
//const Seller = require('./lib/user/SellerContract');
//const Observer = require('./lib/user/ObserverContract');
const UserContract = require('./lib/UserContract');

module.exports.UserContract = UserContract;
module.exports.contracts = [ DataContract, UserContract ];
