import { PrismaClient, SaleType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({ include: { products: true } });
  for (const category of cats) {
    const direct = category.products.filter((p) => p.saleType === "direct").length;
    const custom = category.products.filter((p) => p.saleType === "custom").length;
    const saleType = direct > custom ? SaleType.direct : SaleType.custom;
    await prisma.category.update({
      where: { id: category.id },
      data: { saleType },
    });
    await prisma.product.updateMany({
      where: { categoryId: category.id },
      data: { saleType },
    });
    console.log(category.slug, saleType, "products", category.products.length);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
