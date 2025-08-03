import DodoPayments from "dodopayments";

export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!, // use live or test mode
  environment: "test_mode", // use live or test mode
});
