#!/usr/bin/env bash

./blockchainit

kubectl delete -f yaml/ && \\
sleep 20 && \\
kubectl apply -f yaml/
