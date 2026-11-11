import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/cart/CartView";
import { listProducts } from "@/lib/catalog-queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function CartPage({ params }: Props) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const t = await getTranslations("cart");
  const products = await listProducts(locale);

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20">
      <h1 className="font-display text-3xl text-ink sm:text-5xl">{t("title")}</h1>
      <div className="mt-8">
        <CartView products={products} />
      </div>
    </div>
  );
}
