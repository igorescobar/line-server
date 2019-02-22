#!/bin/bash

docker-compose run --service-ports -e FILE_TO_SERVE=$1 web
