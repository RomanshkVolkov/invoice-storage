#!/bin/bash
set -e

onError() {
  if [ $? -ne 0 ]; then
    echo "Error: $1"
    exit 1
  fi
}

echo "Build docker image"
op run --env-file='./.env' -- docker build -t web-invoice-storage .
onError "Failed to build docker image"

echo "Tagging image"
docker tag web-invoice-storage dwitmexico/invoice-storage:latest.
onError "Failed to tag image"

echo "Pushing image to Docker Hub"
docker push dwitmexico/invoice-storage:latest
onError "Failed to push image to Docker Hub"

echo "Deployed to Docker Hub"
echo "Needed restarting app service on Azure"
echo ""

echo "App service name: web-invoice-storage"
echo "Resource group: RG_OceanWEB"
echo ""

echo "Link azure service: https://portal.azure.com/#@OCEANLEADER1.onmicrosoft.com/resource/subscriptions/9b289da6-0369-411e-bf2b-df2e08671bb9/resourceGroups/RG_OceanWEB/providers/Microsoft.Web/sites/web-invoice-storage/appServices"

echo ""
echo "Link web: https://web-invoice-storage.azurewebsites.net"

