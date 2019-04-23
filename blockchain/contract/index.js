/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const asset = require('./lib/assetcontract');
const buyer = require('./lib/buyercontract');
const seller = require('./lib/sellercontract');

module.exports.asset = asset;
module.exports.buyer = buyer;
module.exports.seller = seller;
module.exports.contracts = [asset, buyer, seller];
