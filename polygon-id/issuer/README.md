# MetaKeep Identity Issuer

This repo contains the cloned Polygon Id(https://devs.polygonid.com/docs/introduction/) issuer code with support for `MetaKeep Hardware Key Management Infrastructure`.

_Note that this is still a work in progress and is not yet ready for production use._

## Run the demo issuer

- Create a `MetaKeep Cryptography BabyJubJub` app on the [MetaKeep console](https://console.metakeep.xyz). Once you have created the app, update the secrets in the `.env-metakeep` file.
- Run `make up` to start test postgres, redis, and vault containers.
- Run `make clean-vault` to clear all the vault data if any
- Run `make run-initializer` to initialize the DID and the vault.
  - To rebuild the initializer image
- Run the issuer server
  - Run `make build-ui` to build the images after making changes
  - Run `make run-ui` to start the issuer server and other services
  - Navigate to `http://localhost:8088` to issue credentials

Please refer to the original [Polygon ID Sample Issuer readme](./README.polygonid.md) for more details regarding the issuer.
