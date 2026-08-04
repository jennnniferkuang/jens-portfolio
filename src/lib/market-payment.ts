export const marketPaymentConfig = {
  feeFixedCents: 0,
  feeRateBps: 300,
  maximumItemCents: 1000000,
  minimumItemCents: 100,
};

export function parseMarketAmount(value: unknown) {
  if (typeof value !== "string" || !/^\d+(?:\.\d{0,2})?$/.test(value)) {
    return null;
  }

  const [dollars, cents = ""] = value.split(".");
  const amount = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));

  if (
    !Number.isSafeInteger(amount) ||
    amount < marketPaymentConfig.minimumItemCents ||
    amount > marketPaymentConfig.maximumItemCents
  ) {
    return null;
  }

  return amount;
}

export function calculateMarketFee(itemCents: number) {
  return (
    Math.ceil((itemCents * marketPaymentConfig.feeRateBps) / 10_000) +
    marketPaymentConfig.feeFixedCents
  );
}
