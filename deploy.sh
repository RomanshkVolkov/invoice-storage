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


# env example
# AUTH_SECRET="op://dwit/invoice-storage/auth_secret"
# DATABASE_URL="op://dwit/invoice-storage/db"
# AZURE_STORAGE_CONNECTION_STRING="op://dwit/invoice-storage/azure_storage_connection_string"
# AZURE_STORAGE_ACCOUNT="op://dwit/invoice-storage/azure_storage_account"
# AZURE_STORAGE_CONTAINER="op://dwit/invoice-storage/azure_storage_container"
# AZURE_BLOB_PATH="op://dwit/invoice-storage/azure_blob_path"

# # Mail credentials
# MAIL_USER="op://dwit/ocean-leader/mail/user"
# MAIL_PASS="op://dwit/ocean-leader/mail/password"