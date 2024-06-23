# !/bin/bash

yarn install

yarn migrate:partner-1
yarn migrate:partner-2

yarn start partner-1-fixture
yarn start partner-2-fixture

yarn start:dev:partner-1 & yarn start:dev:partner-2
