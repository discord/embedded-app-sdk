export interface Env {
  ENVIRONMENT: 'dev' | 'staging' | 'production';
  VITE_CLIENT_ID: string;
  CLIENT_SECRET: string;
  BOT_TOKEN: string;
  VITE_DISCORD_API_BASE: string;
  CF_ACCESS_CLIENT_ID?: string;
  CF_ACCESS_CLIENT_SECRET?: string;
}

export interface IGetOAuthToken {
  access_token: string;
}

export enum SKUAccessTypes {
  FULL = 1,
  EARLY_ACCESS = 2,
  VIP_ACCESS = 3,
}

export const SKUFlags = {
  AVAILABLE: 1 << 2,
};

export enum EntitlementTypes {
  PURCHASE = 1,
  PREMIUM_SUBSCRIPTION = 2,
  DEVELOPER_GIFT = 3,
  TEST_MODE_PURCHASE = 4,
  FREE_PURCHASE = 5,
  USER_GIFT = 6,
  PREMIUM_PURCHASE = 7,
  APPLICATION_SUBSCRIPTION = 8,
}

export interface IGetSKUs {
  id: string;
  type: number;
  dependent_sku_id: string | null;
  application_id: string;
  access_type: SKUAccessTypes;
  name: string;
  slug: string;
  flags: number;
  release_date: string | null;
  price: {
    amount: number;
    currency: string;
  };
}

export interface IGetEntitlements {
  user_id: string;
  sku_id: string;
  application_id: string;
  id: string;
  type: number;
  consumed: boolean;
  payment: {
    id: string;
    currency: string;
    amount: number;
    tax: number;
    tax_inclusive: boolean;
  };
}
