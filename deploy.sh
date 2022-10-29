#!/bin/bash

echo What should the version be?
read VERSION

docker build -t coreymburns/social-backend:$VERSION .
docker push coreymburns/social-backend:$VERSION




