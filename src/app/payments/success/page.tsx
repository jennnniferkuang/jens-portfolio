import Link from "next/link";

import { getStripeClient } from "@/lib/stripe";

type PaymentSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

const cadFormatter = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  style: "currency",
});

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let isPaid = false;
  let total: string | null = null;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(
        sessionId,
      );

      isPaid =
        session.payment_status === "paid" &&
        session.metadata?.source === "art_market";
      total =
        session.amount_total === null
          ? null
          : cadFormatter.format(session.amount_total / 100);
    } catch (error) {
      console.error("Unable to verify Stripe Checkout Session", error);
    }
  }

  return (
    <main className="px-4 py-24">
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-700 bg-neutral-950 p-7 text-center">
        <p className="text-3xl">
          {isPaid ? "Payment confirmed" : "Payment not confirmed"}
        </p>
        <p className="mt-4 text-lg text-neutral-300">
          {isPaid
            ? `${total ?? "Your payment"} was paid successfully. Thank you!`
            : "We couldn't verify a completed payment. Please try again or ask for help."}
        </p>

        <Link
          className="mt-7 inline-block rounded-lg border border-white px-6 py-3 text-lg transition hover:bg-white hover:text-black"
          href="/payments"
        >
          {isPaid ? "Make another payment" : "Return to payment"}
        </Link>
      </div>
    </main>
  );
}
