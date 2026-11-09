import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/cart/CartView";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <div className="mx-auto max-w-6xl px-3 pt-4 pb-16 sm:px-6 sm:pt-6 sm:pb-20">
      <h1 className="font-display text-3xl text-ink sm:text-5xl">{t("title")}</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
