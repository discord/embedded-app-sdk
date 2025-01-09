# Changelog

## [1.9.0](https://github.com/discord/embedded-app-sdk/compare/v1.8.1...v1.9.0) (2025-01-09)


### Features

* add shareLink command ([#297](https://github.com/discord/embedded-app-sdk/issues/297)) ([effd59b](https://github.com/discord/embedded-app-sdk/commit/effd59b378cd969ba82551d95b35e6ac12532ad1))

## [1.8.1](https://github.com/discord/embedded-app-sdk/compare/v1.8.0...v1.8.1) (2024-12-16)


### Bug Fixes

* add new params to IDiscordSDK ([#293](https://github.com/discord/embedded-app-sdk/issues/293)) ([6182474](https://github.com/discord/embedded-app-sdk/commit/618247414b6ae18e9c2fea5b58e2cb49bdeba354))

## [1.8.0](https://github.com/discord/embedded-app-sdk/compare/v1.7.1...v1.8.0) (2024-12-16)


### Features

* add custom_id and referrer_id query params ([96777ac](https://github.com/discord/embedded-app-sdk/commit/96777ac976693309be9019657a60af4044765436))

## [1.7.1](https://github.com/discord/embedded-app-sdk/compare/v1.7.0...v1.7.1) (2024-12-05)


### Bug Fixes

* don't infinitely set the src which triggers the mutation observer again ([#287](https://github.com/discord/embedded-app-sdk/issues/287)) ([7adc57e](https://github.com/discord/embedded-app-sdk/commit/7adc57e9aa020d8beac8839eb4da948d115fe40b))

## [1.7.0](https://github.com/discord/embedded-app-sdk/compare/v1.6.1...v1.7.0) (2024-11-19)


### Features

* openExternalLink returns a `{ opened: boolean | null }` result ([#282](https://github.com/discord/embedded-app-sdk/issues/282)) ([d3bd375](https://github.com/discord/embedded-app-sdk/commit/d3bd375094735a5994f302a29f1845510cc7e045))
* **locationId** added as SDK instance variable ([#281](https://github.com/discord/embedded-app-sdk/pull/281/files)) ([2cb879a](https://github.com/discord/embedded-app-sdk/commit/2cb879af80535b87d4a80cd98597f8ce3062f1cc))


### Bug Fixes

* **authorize:** remove token response type ([#273](https://github.com/discord/embedded-app-sdk/issues/273)) ([f45973b](https://github.com/discord/embedded-app-sdk/commit/f45973babc63dcd33281370b2db969c4cb1b38ca))

## [1.6.1](https://github.com/discord/embedded-app-sdk/compare/v1.6.0...v1.6.1) (2024-10-21)


### Bug Fixes

* bump flag numbers to correct value ([#270](https://github.com/discord/embedded-app-sdk/issues/270)) ([61f4381](https://github.com/discord/embedded-app-sdk/commit/61f4381fa159a5d715c0db6f9be043702d54bcf3))

## [1.6.0](https://github.com/discord/embedded-app-sdk/compare/v1.5.0...v1.6.0) (2024-10-21)


### Features

* extend Constants.Permissions to include all permission flags ([#268](https://github.com/discord/embedded-app-sdk/issues/268)) ([17a2012](https://github.com/discord/embedded-app-sdk/commit/17a2012812384bc6298babebfc619ea17a438b89))

## [1.5.0](https://github.com/discord/embedded-app-sdk/compare/v1.4.3...v1.5.0) (2024-10-01)


### Features

* add sdk_version to HANDSHAKE message ([#262](https://github.com/discord/embedded-app-sdk/issues/262)) ([86a3a17](https://github.com/discord/embedded-app-sdk/commit/86a3a178b4fe37b6e1b8a8f6a719c7068a7ca326))

## [1.4.3](https://github.com/discord/embedded-app-sdk/compare/v1.4.2...v1.4.3) (2024-09-20)


### Bug Fixes

* prevent multiple remappings from applying the .proxy path twice ([#252](https://github.com/discord/embedded-app-sdk/issues/252)) ([1c63d30](https://github.com/discord/embedded-app-sdk/commit/1c63d3043bd7ad79ee2b753a2765e01e97fa566c))

## [1.4.2](https://github.com/discord/embedded-app-sdk/compare/v1.4.1...v1.4.2) (2024-08-13)


### Bug Fixes

* **patchUrlMappings:** recreate script elements when patching their src attribute ([#242](https://github.com/discord/embedded-app-sdk/issues/242)) ([b915ebf](https://github.com/discord/embedded-app-sdk/commit/b915ebf06620b0af758aeeed51a312bde7c42e74))

## [1.4.1](https://github.com/discord/embedded-app-sdk/compare/v1.4.0...v1.4.1) (2024-07-30)


### Bug Fixes

* do not prepend PROXY_PREFIX if already prepends path ([#237](https://github.com/discord/embedded-app-sdk/issues/237)) ([c564b2d](https://github.com/discord/embedded-app-sdk/commit/c564b2dc26ee0f9d687bc22364d2e6677c49eff8))
* prepend /.proxy to discord-starter-activity token fetch ([#233](https://github.com/discord/embedded-app-sdk/issues/233)) ([6e2cd1d](https://github.com/discord/embedded-app-sdk/commit/6e2cd1dda417b1790faae0d777d557ddfddf4c8f))

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
