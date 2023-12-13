import Decimal from 'decimal.js-light';

import {CurrencyCodes, CurrencyExponents} from './PriceConstants';

function formatPrice(price: {amount: number; currency: string}, locale: string = 'en-US'): string {
  const {amount, currency} = price;
  const formatter = Intl.NumberFormat(locale, {style: 'currency', currency});
  return formatter.format(convertToMajorCurrencyUnits(amount, currency as CurrencyCodes));
}

function convertToMajorCurrencyUnits(minorUnitValue: number, currency: CurrencyCodes): number {
  const exponent = CurrencyExponents[currency];
  if (exponent == null) {
    console.warn(`Unexpected currency ${currency}`);
    return minorUnitValue;
  }
  const minorUnit = new Decimal(minorUnitValue);
  return minorUnit.dividedBy(10 ** exponent).toNumber();
}

export default {
  formatPrice,
};
