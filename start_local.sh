#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
export COMPOSE_PROJECT_NAME=privatedatamarketplace
export IMAGE_TAG=1.4
export CHANNEL_NAME=privatedatamarketplace

cd /home/user/Programming/Blockchain/Hyperledger/Fabric/fabric-stellar/blockchain/configuration

# import utils, scripts and initialize
#. $PWD/initialize.sh
#. $PWD/utils.sh

echo $PWD

./initialize.sh generate
./initialize.sh up -l node

#Run cli
#docker exec cli script.sh #$CHANNEL_NAME $CLI_DELAY $LANGUAGE $CLI_TIMEOUT $VERBOSE

ORG1='buyer'
ORG2='seller'
ORG3='observer'

ORG1MSP='BuyerMSP'
ORG2MSP='SellerMSP'
ORG3MSP='ObserverMSP'

CORE_PEER_MSPCONFIGPATH1='/etc/hyperledger/msp/users/Admin@buyer.private.data.marketplace.com/msp'
CORE_PEER_MSPCONFIGPATH2='/etc/hyperledger/msp/users/Admin@seller.private.data.marketplace.com/msp'
CORE_PEER_MSPCONFIGPATH3='/etc/hyperledger/msp/users/Admin@observer.private.data.marketplace.com/msp'

CORE_PEER_ADDRESS01='peer0.buyer.private.data.marketplace.com'
CORE_PEER_ADDRESS11='peer1.buyer.private.data.marketplace.com'

CORE_PEER_ADDRESS02='peer0.seller.private.data.marketplace.com'
CORE_PEER_ADDRESS12='peer1.seller.private.data.marketplace.com'

CORE_PEER_ADDRESS03='peer0.observer.private.data.marketplace.com'
CORE_PEER_ADDRESS13='peer1.observer.private.data.marketplace.com'

echo $PWD

export FABRIC_START_TIMEOUT=10
echo "Fabric timeout: ${FABRIC_START_TIMEOUT} s"
sleep ${FABRIC_START_TIMEOUT}

ORDERER_TLS='/var/hyperledger/orderer/tlsca/tlsca.private.data.marketplace.com-cert.pem'

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer channel create -o orderer.private.data.marketplace.com:7050 -c privatedatamarketplace -f /etc/hyperledger/configtx/channel.tx  #--tls --cafile ${ORDERER_TLS}

# Join the channel
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer channel join -b privatedatamarketplace.block
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer channel join -b privatedatamarketplace.block

docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer channel join -b privatedatamarketplace.block
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer channel join -b privatedatamarketplace.block

docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer channel join -b privatedatamarketplace.block
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer channel join -b privatedatamarketplace.block

# Update anchor peers
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer channel update -o orderer.private.data.marketplace.com:7050 -c privatedatamarketplace -f /etc/hyperledger/configtx/BuyerMSPanchors.tx
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer channel update -o orderer.private.data.marketplace.com:7050 -c privatedatamarketplace -f /etc/hyperledger/configtx/SellerMSPanchors.tx
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer channel update -o orderer.private.data.marketplace.com:7050 -c privatedatamarketplace -f /etc/hyperledger/configtx/ObserverMSPanchors.tx

# Install chaincode
CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/privatedatamarketplace/node"
echo "CC_SRC_PATH:$CC_SRC_PATH"

docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode install -l node -n privatedatamarketplace -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer chaincode install -l node -n privatedatamarketplace -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer chaincode list --installed

docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer chaincode install -l node -n privatedatamarketplace -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer chaincode install -l node -n privatedatamarketplace -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer chaincode list --installed

docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer chaincode install -l node -n privatedatamarketplace -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer chaincode install -l node -n privatedatamarketplace -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer channel list --orderer orderer.private.data.marketplace.com:7050

# Instantiate chaincode
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode instantiate -o orderer.private.data.marketplace.com:7050 -C privatedatamarketplace -n privatedatamarketplace -l node -v 0 -c '{"Args":["privatedatamarketplacecontract:instantiate"]}' -P "OR('BuyerMSP.peer', 'SellerMSP.peer', 'ObserverMSP.peer')"
sleep 10


#Running backend service (only needed if something has changed on backend)
cd ../../backend/
docker-compose -f docker-backend.yaml up -d --build

cd ../blockchain-explorer/
docker-compose -f docker-compose.yaml up -d --build


echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo
exit 0
