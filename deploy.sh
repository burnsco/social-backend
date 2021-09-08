#!/bin/bash

echo What should the version be?
read VERSION

docker build -t coreymburns/redditclone:$VERSION .
docker push coreymburns/redditclone:$VERSION
ssh root@134.122.45.157 "docker pull coreymburns/redditclone:$VERSION && docker tag coreymburns/redditclone:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"