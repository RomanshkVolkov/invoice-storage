# worksn't env vars
TAG=$1

if [ -z "$TAG" ]; then
  TAG=$(git rev-parse --short HEAD)
fi 
echo "Starting web-invoice-storage:$TAG"
op run --env-file='./.env' -- docker run -p 3000:3000 \
  -e AUTH_SECRET=$AUTH_SECRET \
  -e NEXTAUTH_SECRET $AUTH_SECRET \
  -e DATABASE_URL=$DATABASE_URL \
  -e AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING \
  -e AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT \
  -e AZURE_STORAGE_CONTAINER=$AZURE_STORAGE_CONTAINER \
  -e AZURE_BLOB_PATH=$AZURE_BLOB_PATH \
  -e MAIL_USER=$MAIL_USER \
  -e MAIL_PASS=$MAIL_PASS web-invoice-storage:$TAG