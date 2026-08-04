"use client";

import { FormEvent, useMemo, useState } from "react";

type MarketPaymentFormProps = {
  feeFixedCents: number;
  feeRateBps: number;
  maximumItemCents: number;
  minimumItemCents: number;
};

const cadFormatter = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  style: "currency",
});

function formatCad(cents: number) {
  return cadFormatter.format(cents / 100);
}

function parseAmountToCents(value: string) {
  const normalized = value.trim();

  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) {
    return null;
  }

  const [dollars, cents = ""] = normalized.split(".");
  const amount = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));

  return Number.isSafeInteger(amount) ? amount : null;
}

function calculateFeeCents(
  itemCents: number,
  feeRateBps: number,
  feeFixedCents: number,
) {
  return Math.ceil((itemCents * feeRateBps) / 10_000) + feeFixedCents;
}

function formatFeeDescription(feeRateBps: number, feeFixedCents: number) {
  const percentage = `${feeRateBps / 100}%`;

  if (feeRateBps > 0 && feeFixedCents > 0) {
    return `${percentage} + ${formatCad(feeFixedCents)}`;
  }

  if (feeRateBps > 0) {
    return percentage;
  }

  return formatCad(feeFixedCents);
}

export default function MarketPaymentForm({
  feeFixedCents,
  feeRateBps,
  maximumItemCents,
  minimumItemCents,
}: MarketPaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemCents = useMemo(() => parseAmountToCents(amount), [amount]);
  const isWithinRange =
    itemCents !== null &&
    itemCents >= minimumItemCents &&
    itemCents <= maximumItemCents;
  const feeCents = isWithinRange
    ? calculateFeeCents(itemCents, feeRateBps, feeFixedCents)
    : 0;
  const totalCents = isWithinRange ? itemCents + feeCents : 0;
  const feeDescription = formatFeeDescription(feeRateBps, feeFixedCents);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isWithinRange) {
      setError(
        `Enter an item price between ${formatCad(minimumItemCents)} and ${formatCad(maximumItemCents)}.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify({ amount }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to start checkout.");
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-2xl border border-neutral-700 bg-neutral-950 p-5 sm:p-7"
      onSubmit={handleSubmit}
    >
      <label className="block text-lg" htmlFor="market-item-price">
        Item price
      </label>
      <div className="mt-3 flex items-center rounded-lg border border-neutral-600 bg-black px-4 focus-within:border-white">
        <span className="text-neutral-400">CA$</span>
        <input
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-xl outline-none"
          id="market-item-price"
          inputMode="decimal"
          max={(maximumItemCents / 100).toFixed(2)}
          min={(minimumItemCents / 100).toFixed(2)}
          name="amount"
          onChange={(event) => {
            setAmount(event.target.value);
            setError("");
          }}
          placeholder="0.00"
          required
          step="0.01"
          type="number"
          value={amount}
        />
      </div>

      <p className="mt-3 text-sm text-neutral-400">
        A {feeDescription} online payment charge applies to credit and debit
        payments.
      </p>

      {isWithinRange && (
        <div
          aria-live="polite"
          className="mt-6 space-y-3 border-y border-neutral-800 py-5"
        >
          <div className="flex justify-between gap-4 text-neutral-300">
            <span>Item price</span>
            <span>{formatCad(itemCents)}</span>
          </div>
          <div className="flex justify-between gap-4 text-neutral-300">
            <span>Online payment charge ({feeDescription})</span>
            <span>{formatCad(feeCents)}</span>
          </div>
          <div className="flex justify-between gap-4 pt-2 text-xl">
            <span>Total</span>
            <span>{formatCad(totalCents)}</span>
          </div>
        </div>
      )}

      {error && (
        <p aria-live="assertive" className="mt-4 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        className="mt-6 w-full rounded-lg bg-white px-6 py-3 text-lg text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-600"
        disabled={!isWithinRange || isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? "Opening secure checkout…"
          : isWithinRange
            ? `Pay ${formatCad(totalCents)} online`
            : "Enter an item price"}
      </button>

      <p className="mt-4 text-center text-sm text-neutral-500">
        Payment details are collected securely by Stripe.
      </p>
    </form>
  );
}
