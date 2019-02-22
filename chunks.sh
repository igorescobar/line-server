#!/bin/bash

# clean chunks directory
rm -rf src/static/chunks/*

# process chunks of static text file
docker-compose run --rm -e FILE_TO_SERVE=$1 web npm run chunks
