# IAP: In-Application Purchases

## ⚠️ This feature is not available as a part of the Developer Preview

In-Application Purchases (IAP) allows developers to easily monetize their application by offering premium products and services to users without having to worry about payment processing.

This document outlines key concepts of Discord's IAP system, how to get started using the IAP platform, and best practices for success.

# Concepts

This section outlines key concepts of Discord's IAP system.

### SKU

A "Stock Keeping Unit", or SKU, is an identifier used to manage and track inventory. Each SKU is a distinct offering, and can be thought of as a "menu item".

Once a SKU is created, it cannot be deleted, but there are plenty of other ways to manage it such as changing the name or the availability.

At this time, Embedded Applications are limited to two types of SKUs, expressed as an enum in the `sku.type` attribute. The two available types are `SKUType.DURABLE (2)` ("Durable") or `SKUType.CONSUMABLE (3)` ("Consumable"). `DURABLE` SKUs are one-time purchases which permanently entitle the user with the purchased SKU. `CONSUMABLE` SKUs can be purchased many times, and can be marked as consumed. See [Consuming Entitlements](#Consuming-Entitlements) for more info.

Examples of `DURABLE` SKUs include unbreakable-swords, skins, or characters. Example `CONSUMABLE` SKUs include breakable-swords, potions, or admission tickets.

### Entitlement

An Entitlement is the result of a successful purchase. Semantically, an Entitlement record states that an Application gives a User the right to use a SKU. These can be thought of a "purchase receipts".

# Getting Started

## First Things First

Before thinking about monetizing your application, [make sure it's already configured as an Embedded Application](../setting-up-your-discord-application.md#marking-your-application-as-embedded).

## Payout Registration

The next step towards monetizing your Application is to register your Payout Settings for your Application Development team. **In order for your Application to be eligible for IAP, your Application must be owned by a Team and not an individual.**

To register for payout, the owner of the team must log in to the developer portal, select the team they want to monetize, and select the "Payout Settings" option from the sidebar. From the Payout Settings page there is a button to "Get Started". Clicking here will redirect the team owner to Stripe Connect, where the Team Owner can register the official legal information necessary for payout.
![payout-registration](/assets/payout-registration.png)

## Contact Discord for `EMBEDDED_IAP` flag

Once Payout Settings have been registered for a team, applications owned by that team may be eligible to be monetized via IAP. Similarly to how Applications must be marked with `EMBEDDED (1 << 17)` flag in order to be an Application, Applications must be marked as `EMBEDDED_IAP (1 << 3)` in order to create, manage, and sell SKUs.

Reach out to your Discord point of contact to request having your Application marked as `EMBEDDED_IAP`. Please specify the Application ID and the nature of the SKUs you intend to sell.

# A Note on Security and Suggested Approach

Fundamentally, the data obtained via RPC Commands and Events cannot be fully trusted. This is due to the unfortunate reality that a malicious (or curious) actor could establish their own RPC connection and interact with an Application client posing as Discord. For most RPC Commands and Events this is not a problem; spoofing the RPC server simply results in an inconsistent or strange experience for the malicious actor. Premium products, such as those offered during In-Application Purchases, is a very notable exception. If an application were to determine User Entitlements based entirely on RPC data a malicious actor could theoretically abuse Entitlements (most notably `RPCCommands.GET_ENTITLEMENTS`) to their benefit, getting access to premium products, features, or advantages without paying.

On the other hand, data from the Discord HTTP API fetched from a secure environment (such as the application's backend servers) can be trusted and should be treated as the source of truth. This data should invalidate any data received by the client which is found to be inconsistent.

As a result, we **strongly suggest** employing a more secure pattern when dealing with SKUs and Entitlements. This pattern can be summarized as follows:

_Optimistically use client side techniques such as RPC Commands and Events to fetch SKUs and/or Entitlements, but verify the result via the Discord HTTP API from the application backend. In short, Trust (the RPC Server), but Verify (via API)._

# Working With SKUS

SKUs are the "menu items" of your premium store, so being familiar with how they work is key to your Application's store's success.

## Creating a SKU

SKU creation is handled entirely within the developer portal for the Application. Once your Application has been marked as `EMBEDDED_IAP`, a sidebar menu item "SKU Management" will appear under the "Monetization" Section.

![sku-mgmt-sidebar](/assets/sku-mgmt-sidebar.png)

From this SKU Management Page, all SKUs for the Application wil be listed. If none exist, the table will be empty. To create a SKU, simply click "Create SKU", select the type of SKU you wish to create ("Durable", "Consumable"), supply a name in the modal, and select Confirm. Congratulations, you have created a SKU!

![create-sku](/assets/create-sku.png)

Once the SKU is created, you should select a price. The "Price" dropdown will give you an option to select a price tier.

![publish-sku](/assets/publish-sku.png)

The last step of SKU creation is publishing. Methods for listing SKUs such as `RPCCommands.GET_SKUS` will not return unpublished SKUs, so this serves as an availability toggle for Consumable and Durable SKUs. SKUs can be unpublished at any time.

## Listing SKUS

There are two primary ways to list SKUs from your Application code.

### `RPCCommands.GET_SKUS`

This RPC command is used from the Application client, and returns a list of [`Sku`](https://github.com/discord/embedded-app-sdk/blob/a975edc55298c0b2e9a006d7b58319d1777f5ef9/src/schema/common.ts#L490-L501) objects. SKUs without prices are automatically filtered out. The Application client must be authenticated by the user to call this command.

```js
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();
const skus = await discordSdk.commands.getSkus();
console.log(`SKUs: ${skus}`);
```

### `HTTP GET /api/applications/{app-id}/skus`

This HTTP API returns SKUs for an application. This API requires using the Bot token for your application as authorization. This API should be called from the application backend servers, and used as the source of truth for SKUs.

```
curl https://discord.com/api/v6/applications/461618159171141643/skus \
-H "Authorization: Bot <token>" \
-H "Accept: application/json"

// Returns

{
  [
    {
      "id": "53908232599983680",
      "type": 1,
      "flags" 8,
      "dependent_sku_id": null,
      "application_id": "461618159171141643",
      "manifest_labels": ["461618159171111111"],
      "name": "My Awesome Test SKU",
      "access_type": 1,
      "features": [1, 2, 3],
      "system_requirements": {},
      "content_ratings": {},
      "release_date": "1999-01-01",
      "legal_notice": {},
      "price_tier": 1099,
      "price": {},
      "premium": false,
      "locales": ["en-US"],
      "bundled_skus": null
    }
  ]
}

```

## Managing a Storefront

Ultimately, a SKU is simply a record which allows developers to list items for users to purchase using Discord's payment processing. The responsibility of managing a storefront is on the application developers. This section outlines some best practices for mapping SKUs to actual in-application perks and how to deal with localized currencies.

### Product Mapping

As mentioned above, a SKU is simply a bookkeeping record for purchasing via Discord. For users to see any value from purchasing a SKU, the application developer must map SKUs to the application-specific premium asset or perk.

Some reminders and best practices when mapping SKUs to products:

- SKUs should be mapped to product based on `id` attribute, **not** other attributes (such as `name`)
- SKUs can never be deleted, so once purchased it cannot be revoked and must be mapped to an in-application product

### Listing Prices

Our methods for listing SKUs automatically localize currency and prices. This means `sku.price` has both a number `amount` attribute and a string `currency` attribute. Properly rendering the price expected units depending on currency can be challenging given the large number of currencies. DiscordSDK provides a utility to make this easier.

```ts
import {PriceUtils} from '@discord/embedded-app-sdk';

const displayPrice = PriceUtils.formatPrice(sku.price);
console.log(`The price is ${displayPrice}!`);
```

# Working with Entitlements

Entitlements are the "purchase receipts" of the Discord IAP system. Understanding them is key.

## Listing Entitlements

The primary way to list entitlements is via HTTP API.

### `HTTP GET /applications/{app-id}/entitlements`

This HTTP API returns entitlements for a given user. You can use this on your application backend to check entitlements of an arbitrary user, or perhaps in an administrative panel for your support team. This API requires using the Bot token for your application as authorization.

| Name             | Type                              | Description                                           |
| ---------------- | --------------------------------- | ----------------------------------------------------- |
| `user_id?`       | snowflake                         | the user id to look up entitlements for               |
| `sku_ids?`       | comma-delimited set of snowflakes | (optional) the list SKU ids to check entitlements for |
| `with_payments?` | bool                              | returns limited payment data for each entitlement     |
| `before?`        | snowflake                         | retrieve entitlements before this time                |
| `after?`         | snowflake                         | retrieve entitlements after this time                 |
| `limit?`         | int                               | number of entitlements to return, 1-100, default 100  |

```
curl https://discord.com/api/v6/applications/461618159171141643/entitlements?user_id=53908232506183680&sku_ids=53908232599983680&with_payments=true&limit=1 \
-H "Authorization: Bot <token>" \
-H "Accept: application/json"

// Returns

{
  [
    {
      "user_id": "53908232506183680",
      "sku_id": "53908232599983680",
      "application_id": "461618159171141643",
      "id": "53908232506183999",
      "type": 1,
      "payment": {
        "id": "538491076055400999",
        "currency": "usd",
        "amount": 999,
        "tax": 0,
        "tax_inclusive": false
      }
    }
  ]
}
```

## Consuming Entitlements

SKUs which are of type `CONSUMABLE (3)` can be consumed, meaning the corresponding Entitlements for these SKUs can be marked as no longer active. Once consumed, an entitlement will be permanently marked as `consumed: true`.

Consuming Entitlements is perfect for SKUs that are meant to be temporary or ephemeral. Some common examples include a Potion or One-Time Power-Up. For SKUs that are not meant to be consumed (permanent purchases), instead use `DURABLE` SKUs.

### `HTTP POST/applications/{app-id}/entitlements/{entitlement-id}/consume`

Example

```
curl -X POST https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999/consume \
-H "Authorization: Bot <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```

## Filtering Entitlements

Similar to SKUs, Entitlements require some filtering.

Entitlements should be filtered to:

- not include those which have already been `consumed`
- not include Entitlements of type `EntitlementTypes.TEST_MODE_PURCHASE (4)`. These purchases are made in applications launched from the Developer Shelf and should only be valid in development environments.

Example Entitlement filtering:

```js
// Entitlement shape
interface Entitlement {
  user_id: string;
  sku_id: string;
  application_id: string;
  id: string;
  type: number;
  consumed: boolean;
};

// bot token needed for http authorization
const BOT_TOKEN = 'your_bot_token';

// enum for entitlement.type indicating a developer shelf purchase
const TEST_MODE_PURCHASE = 4;

// SKUs we want to check entitlements for
const SKU_IDS = ['1234567890', '2345678901'];

const entitlementsQueryParams = `?user_id=${userId}&sku_ids=${SKU_IDS.join(',')}`;
const entitlementsResponse = await fetch(
  `https://discord.com/api/applications/${applicationId}/entitlements${entitlementsQueryParams}`,
  {
    method: 'GET',
    headers: {
      'Authorization": `Bot ${BOT_TOKEN}`,
    },
  }
);
const entitlementsJSON = await entitlementsResponse.json<[Entitlement]>();
const filteredEntitlements = entitlementsJSON
  .filter(ent => !ent.consumed && !ent.type === TEST_MODE_PURCHASE);
```

# Purchases

Now that you understand SKUs and Entitlements, we can make a purchase.

Purchases are accomplished via RPC commands in the client.

### `RPCCommands.START_PURCHASE`

To initiate a purchase, call the RPC command. This will begin the purchase flow within the Discord client.

```js
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();
await discordSdk.commands.startPurchase({sku_id: skuId});
```

This command only initiates the purchase flow; subscribe to `ENTITLEMENT_CREATE` to know it has been completed.

### `RPCEvents.ENTITLEMENT_CREATE`

This event will fire when an Entitlement is created, most likely as the result of a successful purchase. When this event is received the application should perform an entitlements check on it's server.

```js
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();

const handleEntitlementCreate = () => {
  // refetch entitlements from server
};
discordSdk.subscribe('ENTITLEMENT_CREATE', handleEntitlementCreate);
```

## Test Purchases

As noted above in [Filtering Entitlements](#Filtering-Entitlements), purchases made in applications launched via Developer Shelf create Entitlements with type `EntitlementTypes.TEST_MODE_PURCHASE (4)`. This can be a very helpful workflow when developing an embedded application with in-application purchases.

Here is a brief guide to performing a test purchase.

- [Launch your application via Developer Shelf](launching-your-application.md).
- Call `RPCCommands.START_PURCHASE` from your application.
- Proceed through the purchase flow modal. Note: this requires a valid payment source, although it will not be charged.
- Observe a new Entitlement created, with `type: 4`.

# Examples

Check out our example implementation of IAP in our [SDK Playground Example Application](https://github.com/discord/embedded-app-sdk/tree/decc849d4d7c7e7220f8d5306b2ef36756efde88/examples/sdk-playground).

The example implementation includes [client-side](https://github.com/discord/embedded-app-sdk/blob/decc849d4d7c7e7220f8d5306b2ef36756efde88/examples/sdk-playground/packages/client/src/pages/InAppPurchase.tsx) as well as [backend](https://github.com/discord/embedded-app-sdk/blob/decc849d4d7c7e7220f8d5306b2ef36756efde88/examples/sdk-playground/packages/server/src/handlers/iapHandler.ts) code. This example also follows best security practices explained [above](#A-Note-on-Security-and-Suggested-Approach).
