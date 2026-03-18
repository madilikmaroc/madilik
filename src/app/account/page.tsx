import { getCustomer } from "@/lib/auth/customer-session";
import { AccountContent } from "./account-content";

export default async function AccountPage() {
  const customer = await getCustomer();
  if (!customer) return null;

  return <AccountContent customer={customer} />;
}
