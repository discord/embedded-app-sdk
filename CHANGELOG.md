# Changelog

## [1.4.0](https://github.com/discord/embedded-app-sdk/compare/v1.3.0...v1.4.0) (2024-07-10)


### Features

* add UPDATE_CURRENT_GUILD_MEMBER sdk hook and playground page ([#218](https://github.com/discord/embedded-app-sdk/issues/218)) ([d25deb2](https://github.com/discord/embedded-app-sdk/commit/d25deb298a03c69371b4a0deef7db20279b7e2a8))
* rewrite requests through /.proxy/ using patchUrlMappings  ([#222](https://github.com/discord/embedded-app-sdk/issues/222)) ([44787c5](https://github.com/discord/embedded-app-sdk/commit/44787c52a9611c0dcb9214d7deb49942687011bc))


### Bug Fixes

* **deps:** update dependency esbuild to ^0.23.0 ([#226](https://github.com/discord/embedded-app-sdk/issues/226)) ([63bf436](https://github.com/discord/embedded-app-sdk/commit/63bf436e763c001dc03a02969576aceff9b9425d))

## [1.3.0](https://github.com/discord/embedded-app-sdk/compare/v1.2.0...v1.3.0) (2024-06-25)


### Features

* add applications.commands to OAuthScopes and use the type in authorize command ([#223](https://github.com/discord/embedded-app-sdk/issues/223)) ([d4d319d](https://github.com/discord/embedded-app-sdk/commit/d4d319d96377d6bfe1b082b7399ce51872e2e2a4))


### Bug Fixes

* **deps:** unpin big-integer and decimal.js-light ([#156](https://github.com/discord/embedded-app-sdk/issues/156)) ([860cd87](https://github.com/discord/embedded-app-sdk/commit/860cd874dc7ea21beec58a8adbf81661b910e80d))
* **deps:** update dependency @types/uuid to v10 ([#221](https://github.com/discord/embedded-app-sdk/issues/221)) ([46cf04e](https://github.com/discord/embedded-app-sdk/commit/46cf04e89a21194eb15425d64a1ad3b1f25461a7))
* **deps:** update dependency esbuild to v0.21.3 ([#198](https://github.com/discord/embedded-app-sdk/issues/198)) ([08e77ef](https://github.com/discord/embedded-app-sdk/commit/08e77ef4d80215611c87c5b981533890f8ee19e0))
* **deps:** update dependency eventemitter3 to v5 ([#187](https://github.com/discord/embedded-app-sdk/issues/187)) ([2aa5971](https://github.com/discord/embedded-app-sdk/commit/2aa5971600d339e24aa0648358546b705600b095))
* **deps:** update dependency uuid to v10 ([#217](https://github.com/discord/embedded-app-sdk/issues/217)) ([c7ffadf](https://github.com/discord/embedded-app-sdk/commit/c7ffadf83f927f8c671b0a8cb9424edcdb1101ec))
* remove unavailable options from "setActivity" command ([#193](https://github.com/discord/embedded-app-sdk/issues/193)) ([e70decc](https://github.com/discord/embedded-app-sdk/commit/e70deccc7a473eda53f90d2c643e241dfe683b5b))

## [1.2.0](https://github.com/discord/embedded-app-sdk/compare/v1.1.2...v1.2.0) (2024-04-23)


### Features

* add CommandInput and CommandResponse as types ([6f65ef3](https://github.com/discord/embedded-app-sdk/commit/6f65ef3c8c80c6aa603e9fc6fbc3d8f85dab9f72))


### Bug Fixes

* **deps:** update to uuid v9 ([#118](https://github.com/discord/embedded-app-sdk/issues/118)) ([a25bde1](https://github.com/discord/embedded-app-sdk/commit/a25bde13b3061590d549e4076f51b832f14507cc))

## [1.1.2](https://github.com/discord/embedded-app-sdk/compare/v1.1.1...v1.1.2) (2024-04-04)


### Bug Fixes

* add back frameId to mock ([#97](https://github.com/discord/embedded-app-sdk/issues/97)) ([9a21ca2](https://github.com/discord/embedded-app-sdk/commit/9a21ca211802691efc503261306f5e9aa5e253ab))

## [1.1.1](https://github.com/discord/embedded-app-sdk/compare/v1.1.0...v1.1.1) (2024-04-02)


### Bug Fixes

* remove unused frameId from mock ([#75](https://github.com/discord/embedded-app-sdk/issues/75)) ([facc2f3](https://github.com/discord/embedded-app-sdk/commit/facc2f3f96f6f56191d8f7311b6057f04eb8e02a))

## [1.1.0](https://github.com/discord/embedded-app-sdk/compare/v1.0.0...v1.1.0) (2024-04-01)


### Features

* expose source and sourceOrigin class properties ([#66](https://github.com/discord/embedded-app-sdk/issues/66)) ([f1590b3](https://github.com/discord/embedded-app-sdk/commit/f1590b3980abff50a354c89be5e347fb9878d8d4))


### Bug Fixes

* remove unnecessary FILE_EXTENSION_REGEX check from matchAndRewriteURL ([#65](https://github.com/discord/embedded-app-sdk/issues/65)) ([4616621](https://github.com/discord/embedded-app-sdk/commit/46166212f12e07ba08886ceabfb28d8f1767adf9))
* support ssr and non-browser environments ([#45](https://github.com/discord/embedded-app-sdk/issues/45)) ([2beca00](https://github.com/discord/embedded-app-sdk/commit/2beca00fa2f07be5a6c6837a95513e24c9de5c8d))
