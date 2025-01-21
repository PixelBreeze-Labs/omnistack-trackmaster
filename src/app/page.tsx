import { redirect } from "next/navigation";

export default function Home() {

  // TODO: redirect based on login
  redirect('/crm/ecommerece/dashboard');

  // This won't be rendered due to redirect
  return null;
}
