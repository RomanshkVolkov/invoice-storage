#!/bin/bash

AUTH_SECRET=$(op read op://dwit/invoice-storage/auth_secret)
DATABASE_URL=$(op read op://dwit/invoice-storage/db)
AZURE_STORAGE_CONNECTION_STRING=$(op read op://dwit/invoice-storage/azure_storage_connection_string)
AZURE_STORAGE_ACCOUNT=$(op read op://dwit/invoice-storage/azure_storage_account)
AZURE_STORAGE_CONTAINER=$(op read op://dwit/invoice-storage/azure_storage_container)
AZURE_BLOB_PATH=$(op read op://dwit/invoice-storage/azure_blob_path)

MAIL_USER=$(op read op://dwit/ocean-leader/mail/user)
MAIL_PASS=$(op read op://dwit/ocean-leader/mail/password)

docker build -e AUTH_SECRET=$AUTH_SECRET -e DATABASE_URL=$DATABASE_URL -e AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING -e AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT -e AZURE_STORAGE_CONTAINER=$AZURE_STORAGE_CONTAINER -e AZURE_BLOB_PATH=$AZURE_BLOB_PATH -e MAIL_USER=$MAIL_USER -e MAIL_PASS=$MAIL_PASS -t web-invoice-storage .

docker tag web-invoice-storage dwitmexico/invoice-storage:latest
docker push dwitmexico/invoice-storage:latest

echo "Deployed to Docker Hub"
echo "Restarting app service on Azure"
echo ""
echo "App service name: web-invoice-storage"
echo "Resource group: RG_OceanWEB"
echo "Link azure service: https://portal.azure.com/#@OCEANLEADER1.onmicrosoft.com/resource/subscriptions/9b289da6-0369-411e-bf2b-df2e08671bb9/resourceGroups/RG_OceanWEB/providers/Microsoft.Web/sites/web-invoice-storage/appServices"
echo "Link web: https://web-invoice-storage.azurewebsites.net


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