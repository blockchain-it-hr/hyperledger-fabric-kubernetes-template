/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const accessToken = require('./lib/AccessTokenContract');
const data = require('./lib/DataContract');
const buyer = require('./lib/user/BuyerContract');
const seller = require('./lib/user/SellerContract');
const observer = require('./lib/user/ObserverContract');

module.exports.accessToken = accessToken;
module.exports.data = data;
module.exports.buyer = buyer;
module.exports.seller = seller;
module.exports.observer = observer;
module.exports.contracts = [accessToken, data, buyer, seller, observer];
