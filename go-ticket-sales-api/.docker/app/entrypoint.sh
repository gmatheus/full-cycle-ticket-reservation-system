#!/bin/bash

apk update && apk add make
go install github.com/swaggo/swag/cmd/swag@latest
make build prod
