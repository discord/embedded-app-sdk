import React from 'react';
import {authStore} from '../stores/authStore';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {Sku, SkuType} from '../types';
import {PriceUtils} from '@discord/embedded-app-sdk';

interface Entitlement {
  sku_id: string;
  id: string;
}

export default function InAppPurchase() {
  const applicationId = import.meta.env.VITE_APPLICATION_ID;
  const {user} = authStore.getState();

  const [showTestModeEntitlements, setShowTestModeEntitlements] = React.useState<boolean>(false);

  const [inspectSkusRPC, setInspectSkusRPC] = React.useState<boolean>(false);
  const [inspectSkusAPI, setInspectSkusAPI] = React.useState<boolean>(false);
  const [inspectEntitlements, setInspectEntitlments] = React.useState<boolean>(false);

  const [rpcSkus, setRpcSkus] = React.useState<Sku[]>([]);
  const [apiSkus, setApiSkus] = React.useState<Sku[]>([]);
  const [durableSkus, setDurableSkus] = React.useState<Sku[]>([]);
  const [consumableSkus, setConsumableSkus] = React.useState<Sku[]>([]);
  const [subscriptionSkus, setSubscriptionSkus] = React.useState<Sku[]>([]);
  const [entitlements, setEntitlements] = React.useState<Entitlement[]>([]);

  const skuIsAvailable: (sku: Sku) => boolean = (sku: Sku) => {
    const apiSku = apiSkus.find((apiSku) => apiSku.id == sku.id);
    // apiSkus are fetched from server and filtered for availability in iapHandler
    // (examples/iframe-playground/packages/server/src/handlers/iapHandler.ts)
    // as a result, we can use the presence of the sku from API as proxy for availability
    return apiSku != null;
  };

  const entitlementForSku: (sku: Sku) => Entitlement | undefined = (sku: Sku) => {
    const entitlement = entitlements.find((ent) => ent.sku_id == sku.id);
    return entitlement;
  };

  const getSkusRPC = async () => {
    setRpcSkus([]);
    try {
      const {skus} = await discordSdk.commands.getSkus();
      setRpcSkus(skus);
    } catch (e: any) {
      console.warn(e);
    }
  };

  const getSkusAPI = React.useCallback(async () => {
    setApiSkus([]);
    try {
      const skusResp = await fetch(`/api/iap/${applicationId}/skus`);
      const skusJSON = await skusResp.json<{skus: Sku[]}>();
      setApiSkus(skusJSON.skus);
    } catch (e: any) {
      console.warn(e);
    }
  }, [applicationId]);

  const getEntitlements = React.useCallback(async () => {
    setEntitlements([]);
    const entitlementsResp = await fetch(
      `/api/iap/${applicationId}/entitlements/${user.id}?show_test=${showTestModeEntitlements ? 1 : 0}`
    );
    const entitlementsJSON = await entitlementsResp.json<{entitlements: Entitlement[]}>();
    setEntitlements(entitlementsJSON.entitlements);
  }, [applicationId, showTestModeEntitlements, user.id]);

  const startPurchase = async (skuId: string) => {
    try {
      await discordSdk.commands.startPurchase({sku_id: skuId});
    } catch (e: any) {
      console.warn(e);
    }
  };

  const consume = async (entitlementId: string) => {
    try {
      await fetch(`/api/iap/${applicationId}/consume/${entitlementId}`);
      await getEntitlements();
    } catch (e: any) {
      console.warn(e);
    }
  };

  const refresh = React.useCallback(() => {
    getSkusRPC();
    getSkusAPI();
    getEntitlements();
  }, [getEntitlements, getSkusAPI]);

  React.useEffect(() => {
    refresh();
  }, [applicationId, user.id, showTestModeEntitlements, refresh]);

  // partition durable vs consumable SKUs
  React.useEffect(() => {
    const durables: Sku[] = [];
    const consumables: Sku[] = [];
    const subscriptions: Sku[] = [];
    rpcSkus.forEach((sku) => {
      switch (sku.type) {
        case SkuType.CONSUMABLE:
          consumables.push(sku);
          break;
        case SkuType.DURABLE:
          durables.push(sku);
          break;
        case SkuType.SUBSCRIPTION:
          subscriptions.push(sku);
          break;
        default:
      }
    });
    setDurableSkus(durables);
    setConsumableSkus(consumables);
    setSubscriptionSkus(subscriptions);
  }, [rpcSkus]);

  React.useEffect(() => {
    // when an entitlement is created, refetch entitlements from server
    discordSdk.subscribe('ENTITLEMENT_CREATE', getEntitlements);
    return () => {
      discordSdk.unsubscribe('ENTITLEMENT_CREATE', getEntitlements);
    };
  });

  return (
    <div style={{padding: 32}}>
      <h1> In App Purchases </h1>
      <br />
      <div>
        <h3> Consumable SKUs</h3>
        {consumableSkus.map((sku) => {
          const entitlement = entitlementForSku(sku);
          const owned = entitlement != null;
          const price = PriceUtils.formatPrice(sku.price);
          return (
            <div key={sku.id}>
              <button disabled={!skuIsAvailable(sku) || owned} onClick={() => startPurchase(sku.id)}>
                Purchase {sku.name} for {price}
              </button>
              <button disabled={!owned} onClick={() => (entitlement != null ? consume(entitlement.id) : () => {})}>
                Consume {sku.name}
              </button>
              <br />
            </div>
          );
        })}
      </div>
      <br />
      <div>
        <h3> Persistent SKUs</h3>
        {durableSkus.map((sku) => {
          const price = PriceUtils.formatPrice(sku.price);
          return (
            <div key={sku.id}>
              <button
                disabled={!skuIsAvailable(sku) || entitlementForSku(sku) != null}
                onClick={() => startPurchase(sku.id)}>
                Purchase {sku.name} for {price}
              </button>
              <br />
            </div>
          );
        })}
      </div>
      <br />
      <div>
        <h3> Subscription SKUs</h3>
        {subscriptionSkus.map((sku) => {
          const price = PriceUtils.formatPrice(sku.price);
          return (
            <div key={sku.id}>
              <button
                disabled={!skuIsAvailable(sku) || entitlementForSku(sku) != null}
                onClick={() => startPurchase(sku.id)}>
                Purchase {sku.name} for {price}
              </button>
              <br />
            </div>
          );
        })}
      </div>
      <br />
      <h3> Debug </h3>
      <div>
        <button onClick={() => refresh()}>Refresh</button>
        <br />
        <div></div>
        <br />
      </div>
      <div>
        <p> Test Mode Entitlements {showTestModeEntitlements ? 'are' : 'are not'} included in fetched entitlements</p>
        <button onClick={() => setShowTestModeEntitlements(!showTestModeEntitlements)}>
          {showTestModeEntitlements ? 'Hide' : 'Show'} Test Mode Entitements
        </button>
      </div>
      <div>
        <br />
        {inspectSkusAPI ? (
          <div>
            <button onClick={() => setInspectSkusAPI(false)}> Close Inspect API SKUs </button>
            <h3> SKUs </h3>
            <ReactJsonView src={apiSkus} />
          </div>
        ) : (
          <button onClick={() => setInspectSkusAPI(true)}> Inspect API SKUs </button>
        )}
      </div>
      <div>
        <br />
        {inspectSkusRPC ? (
          <div>
            <button onClick={() => setInspectSkusRPC(false)}> Close Inspect RPC SKUs </button>
            <h3> SKUs </h3>
            <ReactJsonView src={rpcSkus} />
          </div>
        ) : (
          <button onClick={() => setInspectSkusRPC(true)}> Inspect RPC SKUs </button>
        )}
      </div>
      <div>
        <br />
        {inspectEntitlements ? (
          <div>
            <button onClick={() => setInspectEntitlments(false)}> Close Inspect Entitlements </button>
            <h3> Entitlements </h3>
            <ReactJsonView src={entitlements} />
          </div>
        ) : (
          <button onClick={() => setInspectEntitlments(true)}> Inspect Entitlements </button>
        )}
      </div>
    </div>
  );
}
