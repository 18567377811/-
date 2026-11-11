import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/home/HomePage";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage />;
}
