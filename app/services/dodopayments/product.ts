import { dodoPayments } from "./payment";

async function listProducts() {
  try {
    const products = await dodoPayments.products.list();
  } catch (error) {
    console.log("some error has occured");
  }
}
