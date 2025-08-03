import { dodoPayments } from "./payment";

export async function listProducts() {
  try {
    const products = await dodoPayments.products.list();
    console.log(products);
  } catch (error) {
    console.log(error);
  }
}
