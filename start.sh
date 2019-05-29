#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo 

. ./.env

echo ${INSTALLATION_PATH}
cd ${INSTALLATION_PATH}
echo $PWD

./initialize.sh generate
./initialize.sh up -l node

CORE_PEER_MSPCONFIGPATH1='/etc/hyperledger/msp/users/Admin@${ORG1}.${NAMESPACE}.com/msp'
CORE_PEER_MSPCONFIGPATH2='/etc/hyperledger/msp/users/Admin@${ORG2}.${NAMESPACE}.com/msp'
CORE_PEER_MSPCONFIGPATH3='/etc/hyperledger/msp/users/Admin@${ORG3}.${NAMESPACE}.com/msp'

CORE_PEER_ADDRESS01='peer0.${ORG1}.${NAMESPACE}.com'
CORE_PEER_ADDRESS11='peer1.${ORG1}.${NAMESPACE}.com'

CORE_PEER_ADDRESS02='peer0.${ORG2}.${NAMESPACE}.com'
CORE_PEER_ADDRESS12='peer1.${ORG2}.${NAMESPACE}.com'

CORE_PEER_ADDRESS03='peer0.${ORG3}.${NAMESPACE}.com'
CORE_PEER_ADDRESS13='peer1.${ORG3}.${NAMESPACE}.com'

ORDERER_TLS='/var/hyperledger/orderer/tlsca/tlsca.${NAMESPACE}.com-cert.pem'

echo $PWD
export FABRIC_START_TIMEOUT=10
echo "Fabric timeout: ${FABRIC_START_TIMEOUT} s"
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer channel create -o orderer.valid.swap.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/channel.tx  #--tls --cafile ${ORDERER_TLS}

# Join the channel
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer channel join -b ${CHANNEL_NAME}.block
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer channel join -b ${CHANNEL_NAME}.block

docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer channel join -b ${CHANNEL_NAME}.block
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer channel join -b ${CHANNEL_NAME}.block

docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer channel join -b ${CHANNEL_NAME}.block
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer channel join -b ${CHANNEL_NAME}.block

sleep 12

# Update anchor peers
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer channel update -o orderer.${NAMESPACE}.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/${ORG1MSP}anchors.tx
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer channel update -o orderer.${NAMESPACE}.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/${ORG2MSP}anchors.tx
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer channel update -o orderer.${NAMESPACE}.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/${ORG3MSP}anchors.tx

sleep 15

# Install chaincode
CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/validswap/node"
echo "CC_SRC_PATH:$CC_SRC_PATH"

docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode install -l node -n ${NAMESPACE} -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer chaincode install -l node -n ${NAMESPACE} -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer chaincode list --installed

sleep 2

docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer chaincode install -l node -n ${NAMESPACE} -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer chaincode install -l node -n ${NAMESPACE} -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer chaincode list --installed

sleep 2

docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer chaincode install -l node -n ${NAMESPACE} -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer chaincode install -l node -n ${NAMESPACE} -v 0 -p "$CC_SRC_PATH"
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer chaincode list --installed
docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer channel list --orderer orderer.${NAMESPACE}.com:7050

sleep 2

# Instantiate chaincode
docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode instantiate -o orderer.${NAMESPACE}.com:7050 -C ${CHANNEL_NAME} -n ${NAMESPACE} -l node -v 0 -c '{'Args':['${CONTRACT_NAME}:instantiate']}' -P "OR('${ORG1MSP}.peer', '${ORG2MSP}.peer', '${ORG3MSP}.peer')"
sleep 10

#docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS01} peer chaincode invoke -o orderer.valid.swap.com:7050 -C validswap -n validswap -c '{"function":"createAsset","Args":["owner1", "1", "Apples", "food", "issueDateTime", "expirationDateTime", "cost", "description"]}'
#docker exec -e "CORE_PEER_LOCALMSPID=${ORG1MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH1}" ${CORE_PEER_ADDRESS11} peer chaincode invoke -o orderer.valid.swap.com:7050 -C validswap -n validswap -c '{"function":"createAsset","Args":["owner1", "1", "Oranges", "food", "issueDateTime", "expirationDateTime", "cost", "description"]}'
#docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS02} peer chaincode invoke -o orderer.valid.swap.com:7050 -C validswap -n validswap -c '{"function":"createAsset","Args":["owner1", "1", "Watermelon", "food", "issueDateTime", "expirationDateTime", "cost", "description"]}'
#docker exec -e "CORE_PEER_LOCALMSPID=${ORG2MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH2}" ${CORE_PEER_ADDRESS12} peer chaincode invoke -o orderer.valid.swap.com:7050 -C validswap -n validswap -c '{"function":"createAsset","Args":["owner1", "1", "Peaches", "food", "issueDateTime", "expirationDateTime", "cost", "description"]}'
#docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS03} peer chaincode invoke -o orderer.valid.swap.com:7050 -C validswap -n validswap -c '{"function":"createAsset","Args":["owner1", "1", "Potato", "food", "issueDateTime", "expirationDateTime", "cost", "description"]}'
#docker exec -e "CORE_PEER_LOCALMSPID=${ORG3MSP}" -e "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH3}" ${CORE_PEER_ADDRESS13} peer chaincode invoke -o orderer.valid.swap.com:7050 -C validswap -n validswap -c '{"function":"createAsset","Args":["owner1", "1", "Zanax", "drug", "issueDateTime", "expirationDateTime", "cost", "description"]}'


#Running backend service (only needed if something has changed on backend)
cd ../../backend/
docker-compose -f docker-backend.yaml up -d --build

sleep 10

#cd ../blockchain-explorer/
#docker-compose -f docker-compose.yaml up -d --build

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo
#FoodProducer:User12,1,Apple,food,issueDateTime,expirationDateTime,cost,description CREATE
#FoodProducer:User12,1,Transporter:User1,Apple,issueDateTime,expirationDateTime,cost,description UPDATE
exit 0
