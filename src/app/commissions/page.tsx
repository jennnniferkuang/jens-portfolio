const STRIPE_MARKET_PAYMENT_LINK = "https://buy.stripe.com/8x27sKgWe4JY5pw5eBcs800";

export default function Commissions() {
  return (
    <div className="px-4 py-24">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div>
          <p className="text-3xl">Pay here</p>
          <p className="mt-3 text-lg text-neutral-300">
            You&apos;ll enter the amount securely on Stripe&apos;s checkout page.
          </p>
        </div>

        <a
          className="w-fit rounded border border-white px-6 py-3 text-lg transition hover:bg-white hover:text-black"
          href={STRIPE_MARKET_PAYMENT_LINK}
        >
          Continue to Stripe Checkout
        </a>
      </div>
    </div>
  );
}
