/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const asset = require('./lib/assetcontract');
const buyer = require('./lib/user/buyercontract');
const seller = require('./lib/user/sellercontract');

module.exports.asset = asset;
module.exports.buyer = buyer;
module.exports.seller = seller;
module.exports.contracts = [asset, buyer, seller];
