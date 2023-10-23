#!/bin/bash

set -e

POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--domain)
      DOMAIN="$2"
      shift # past argument
      shift # past value
      ;;
    -t|--target)
      TARGET="$2"
      shift # past argument
      shift # past value
      ;;
    -u|--user)
      USER="$2"
      shift # past argument
      shift # past value
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift # past argument
      ;;
  esac
done

if [ -z "$DOMAIN" ]; then
  echo "Enter domain:"
  read DOMAIN
fi
if [ -z "$TARGET" ]; then
    TARGET="$DOMAIN"
fi

# Ask for ssh password
if [ -z "$USER" ]; then
  echo "Enter ssh username:"
  read USER
fi

# Ask for ssh password
echo "Enter ssh password for $USER:"
read -s PASSWORD

echo "Building and deploying to $TARGET with domain $DOMAIN"

docker build -t $DOMAIN/graphql -f ../.dockerfile ..

# Cache the value of the .env file
cp ../askebakken-app/.env ../askebakken-app/.env.bak

# Replace .env variables with production values
sed -i "s|VITE_GRAPHQL_ENDPOINT=.*|VITE_GRAPHQL_ENDPOINT=https://$DOMAIN/graphql|g" ../askebakken-app/.env
sed -i "s|VITE_GRAPHQL_WEBSOCKET_ENDPOINT=.*|VITE_GRAPHQL_WEBSOCKET_ENDPOINT=wss://$DOMAIN/graphql|g" ../askebakken-app/.env

# Restore .env to development values
cp ../askebakken-app/.env.bak ../askebakken-app/.env
rm ../askebakken-app/.env.bak

docker build -t $DOMAIN/app -f ../askebakken-app/.dockerfile ../askebakken-app

docker save $DOMAIN/graphql -o askebakken-graphql
docker save $DOMAIN/app -o askebakken-app

DEPLOY_TO_URL="$USER@$TARGET"

function execute_password_authenticated() {
    sshpass -p $PASSWORD $@
}

execute_password_authenticated "scp askebakken-graphql $DEPLOY_TO_URL:~"
execute_password_authenticated "scp askebakken-app $DEPLOY_TO_URL:~"
execute_password_authenticated ssh $DEPLOY_TO_URL "docker load -i askebakken-graphql"
execute_password_authenticated ssh $DEPLOY_TO_URL "docker load -i askebakken-app"

echo -e "\033[0;32mDeployed to $TARGET with domain $DOMAIN\033[0m"
echo -e "\033[0;33mYou must manually restart the docker containers on the server\033[0m"
