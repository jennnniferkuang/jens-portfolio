import { NextResponse } from "next/server";

import {
  calculateMarketFee,
  parseMarketAmount,
} from "@/lib/market-payment";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { amount?: unknown };
    const itemCents = parseMarketAmount(body.amount);

    if (itemCents === null) {
      return NextResponse.json(
        { error: "Enter a valid item price." },
        { status: 400 },
      );
    }

    const feeCents = calculateMarketFee(itemCents);
    const stripe = getStripeClient();
    const origin = new URL(request.url).origin;
    const lineItems = [
      {
        price_data: {
          currency: "cad",
          product_data: { name: "Art market purchase" },
          unit_amount: itemCents,
        },
        quantity: 1,
      },
      ...(feeCents > 0
        ? [
            {
              price_data: {
                currency: "cad",
                product_data: { name: "Online payment charge" },
                unit_amount: feeCents,
              },
              quantity: 1,
            },
          ]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      cancel_url: `${origin}/payments`,
      line_items: lineItems,
      metadata: {
        item_amount_cents: itemCents.toString(),
        online_payment_charge_cents: feeCents.toString(),
        source: "art_market",
      },
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session", error);

    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
