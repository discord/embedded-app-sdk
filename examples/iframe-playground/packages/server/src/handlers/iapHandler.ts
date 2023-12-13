import {Env, IGetEntitlements, IGetSKUs, EntitlementTypes, SKUFlags} from '../types';
import {hasFlag, requestHeaders} from '../utils';

async function getSkus(applicationId: string, env: Env): Promise<IGetSKUs[]> {
  const skusFetch = await fetch(`${env.VITE_DISCORD_API_BASE}/applications/${applicationId}/skus`, {
    method: 'GET',
    headers: requestHeaders(env),
  });
  const skusJSON = await skusFetch.json<[IGetSKUs]>();
  return skusJSON.filter((sku) => {
    const available = hasFlag(sku.flags, SKUFlags.AVAILABLE);
    const released = sku.release_date != null ? new Date(sku.release_date) < new Date() : true;
    return available && released;
  });
}

async function getSkusHandler(path: string[], request: Request, env: Env) {
  const applicationId = path[1];
  try {
    const skus = await getSkus(applicationId, env);
    return new Response(JSON.stringify({skus}), {
      headers: {'Access-Control-Allow-Origin': '*'},
    });
  } catch (ex) {
    console.error(ex);
    return new Response(`Internal Error: ${ex}`, {status: 500});
  }
}

async function getEntitlements(path: string[], request: Request, env: Env) {
  const applicationId = path[1];
  const userId = path[3];
  const {searchParams} = new URL(request.url);
  const showTest = (searchParams.get('show_test') ?? '0') == '1';
  try {
    const skuIds = (await getSkus(applicationId, env)).map((sku) => sku.id);
    const entitlementsQueryParams = `?user_id=${userId}&sku_ids=${skuIds.join(',')}`;
    const entitlementsFetch = await fetch(
      `${env.VITE_DISCORD_API_BASE}/applications/${applicationId}/entitlements${entitlementsQueryParams}`,
      {
        method: 'GET',
        headers: requestHeaders(env),
      }
    );
    const entitlementsJSON = await entitlementsFetch.json<[IGetEntitlements]>();
    const entitlements = entitlementsJSON
      .filter((ent) => !ent.consumed)
      .filter((ent) => showTest || ent.type !== EntitlementTypes.TEST_MODE_PURCHASE)
      .map((ent) => {
        return {sku_id: ent.sku_id, id: ent.id};
      });
    return new Response(JSON.stringify({entitlements}), {
      headers: {'Access-Control-Allow-Origin': '*'},
    });
  } catch (ex) {
    console.error(ex);
    return new Response(`Internal Error: ${ex}`, {status: 500});
  }
}

async function postConsume(path: string[], request: Request, env: Env) {
  const applicationId = path[1];
  const entitlementId = path[3];
  try {
    const consumePost = await fetch(
      `${env.VITE_DISCORD_API_BASE}/applications/${applicationId}/entitlements/${entitlementId}/consume`,
      {
        method: 'POST',
        headers: requestHeaders(env),
      }
    );
    if (!consumePost.ok) {
      const consumeText = await consumePost.text();
      throw new Error(`Error: ${consumeText}`);
    } else {
      return new Response(`Consumed ${entitlementId}`);
    }
  } catch (ex: any) {
    console.error(ex);
    return new Response(`Internal Error: ${ex}`, {status: 500});
  }
}

export default function iapHandler(path: string[], request: Request, env: Env) {
  const route = path[2];
  switch (route) {
    // GET /api/iap/<application_id>/entitlements/<user_id>
    case 'entitlements':
      return getEntitlements(path, request, env);

    // POST /api/iap/<application_id>/consume/<entitlement_id>
    case 'consume':
      return postConsume(path, request, env);

    // GET/api/iap/<application_id>/skus
    case 'skus':
      return getSkusHandler(path, request, env);
    default:
      console.warn(`unknown path ${path.join('/')}`);
      return new Response('Not found', {status: 404});
  }
}
