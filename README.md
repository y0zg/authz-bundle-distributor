# authz-bundle-distributor

Yeoman templated project

## Local Development

1. For local development run:
   - `./bin/setup.sh`
1. Run `$ yarn test` to run tests
1. Run `$ yarn start` to run locally
1. Run `$ yarn build` (or `tsc` with config) to compile code

Note that there are two tsconfig options:
* `tsconfig.json` (default `tsc` behaviour) will build all code _including_ tests - for localdev
* `tsconfig.build.json` (default `yarn build` behaviour) will build all code _excluding_ tests - for CI/CD, no tests in production images
