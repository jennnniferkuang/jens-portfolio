import MarketPaymentForm from "@/components/market-payment-form";
import { marketPaymentConfig } from "@/lib/market-payment";

export default function Payments() {
  return (
    <main className="px-4 py-24">
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <div>
          <p className="text-3xl">Art market payment</p>
          <p className="mt-3 text-lg text-neutral-300">
            Enter the price of your item below.
          </p>
        </div>

        <MarketPaymentForm
          feeFixedCents={marketPaymentConfig.feeFixedCents}
          feeRateBps={marketPaymentConfig.feeRateBps}
          maximumItemCents={marketPaymentConfig.maximumItemCents}
          minimumItemCents={marketPaymentConfig.minimumItemCents}
        />
      </div>
    </main>
  );
}
