#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -e

# Shut down the Docker containers for the system tests.
#docker-compose -f docker-compose.yaml kill && docker-compose -f docker-compose.yaml down

rm -rf blockchain/configuration/crypto-config
rm -rf blockchain/configuration/channel-artifacts
rm -rf blockchain/configuration/org.*
rm -rf blockchain/configuration/chaincode
rm -rf blockchain/configuration/blockchain
rm -rf blockchain/configuration/orderer.*
rm -rf blockchain/configuration/configx
rm -rf blockchain/chaincode
rm -rf backend/wallet

mkdir backend/wallet
mkdir backend/wallet/buyer
mkdir backend/wallet/seller
mkdir backend/wallet/observer
chmod -R 777 backend/wallet

# remove the local state
rm -f ~/.hfc-key-store/*

docker rm -f $(docker ps -a -q) || true
docker rmi $(docker images dev-* -q) || true
docker volume prune || true
