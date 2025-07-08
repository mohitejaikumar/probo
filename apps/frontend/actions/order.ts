"use server";

import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CASHFREE_CLIENT_API_KEY,
  process.env.CASHFREE_CLIENT_PASSWORD
);

export async function createOrder(
  amount: number,
  userId: string
): Promise<string | undefined> {
  console.log("processing the payment");

  const request = {
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: userId,
      customer_name: "",
      customer_email: "example@gmail.com",
      customer_phone: "9999999999",
    },
    order_meta: {
      return_url: "https://895a5762cb3e.ngrok-free.app/",
    },
    order_note: "",
  };
  try {
    const response = await cashfree.PGCreateOrder(request);
    console.log("orderCreation: ", response.data);
    return response.data.payment_session_id;
  } catch (err) {
    // @ts-ignore
    console.log("error: ", err);
    return undefined;
  }
}
