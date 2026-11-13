import { setRequestLocale } from "next-intl/server";
import { PayPalReturnClient } from "@/components/checkout/PayPalReturnClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; PayerID?: string }>;
};

export default async function PayPalReturnPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);

  return <PayPalReturnClient token={token?.trim() || null} />;
}
