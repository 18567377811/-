import { DisplayMode, PrismaClient, SaleType } from "@prisma/client";

const prisma = new PrismaClient();

async function wipeCatalog() {
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.heroSlide.deleteMany();
}

async function main() {
  const force = process.argv.includes("--force");
  const existing = await prisma.category.count();
  if (existing > 0 && !force) {
    console.log("[seed] skip — database already has categories (pass --force to wipe)");
    return;
  }

  if (existing > 0) {
    console.log("[seed] wiping categories, products, variants, hero slides…");
    await wipeCatalog();
  }

  const portrait = await prisma.category.create({
    data: {
      slug: "portrait",
      nameZh: "肖像",
      nameEn: "Portrait",
      nameMs: "Potret",
      descriptionZh: "装裱羊毛肖像，细致还原宠物神情。",
      descriptionEn:
        "Framed wool-painted portraits that capture your pet’s expression with museum-level care.",
      descriptionMs:
        "Potret bulu berbingkai yang menangkap ekspresi haiwan anda dengan penuh teliti.",
      hintZh: "装裱肖像",
      hintEn: "Framed likeness",
      hintMs: "Potret berbingkai",
      coverImage:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80",
      displayMode: DisplayMode.featured,
      saleType: SaleType.custom,
      showOnHome: true,
      sortOrder: 0,
    },
  });

  const miniature = await prisma.category.create({
    data: {
      slug: "miniature",
      nameZh: "迷你全身",
      nameEn: "Miniature",
      nameMs: "Miniatur",
      descriptionZh: "针毡全身微缩——小巧却有强烈存在感的纪念物。",
      descriptionEn:
        "Full-body felted figurines — compact keepsakes with remarkable presence.",
      descriptionMs:
        "Figurin badan penuh dari felt — cenderamata padat dengan kehadiran yang kuat.",
      hintZh: "可抱可摆",
      hintEn: "Hold & display",
      hintMs: "Boleh dipegang",
      coverImage:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=80",
      displayMode: DisplayMode.grid,
      saleType: SaleType.direct,
      showOnHome: true,
      sortOrder: 1,
    },
  });

  await prisma.product.create({
    data: {
      id: "portrait-dog",
      slug: "framed-pet-portrait-dog",
      categoryId: portrait.id,
      saleType: SaleType.custom,
      nameZh: "装裱宠物肖像 — 狗狗",
      nameEn: "Framed Pet Portrait — Dog",
      nameMs: "Potret Haiwan Berbingkai — Anjing",
      summaryZh: "装裱羊毛肖像，定格你家狗狗独一无二的脸。",
      summaryEn:
        "A framed wool portrait that captures your dog’s unmistakable face.",
      summaryMs:
        "Potret bulu berbingkai yang menangkap wajah unik anjing anda.",
      descriptionZh:
        "根据照片层层植毛，手绘眼睛与五官。适合纪念与长久珍藏。",
      descriptionEn:
        "Built fiber by fiber from your photos, with hand-finished eyes and features. Ideal for memorials and forever keepsakes.",
      descriptionMs:
        "Dibina serat demi serat daripada foto anda, dengan mata dan ciri yang disiapkan tangan. Sesuai untuk memorial dan kenangan abadi.",
      priceFromUsd: 680,
      turnaroundMonths: "3–8",
      rating: 5,
      inStock: true,
      keywords: JSON.stringify([
        "dog",
        "犬",
        "狗",
        "portrait",
        "肖像",
        "framed",
      ]),
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 0,
      variants: {
        create: [
          {
            id: "dog-solid",
            labelZh: "单色 / 双色",
            labelEn: "Solid & bicolor",
            labelMs: "Solid & dua warna",
            priceUsd: 680,
            sortOrder: 0,
          },
          {
            id: "dog-complex",
            labelZh: "复杂毛色",
            labelEn: "Complex coat",
            labelMs: "Corak bulu kompleks",
            priceUsd: 780,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "portrait-cat",
      slug: "framed-pet-portrait-cat",
      categoryId: portrait.id,
      saleType: SaleType.custom,
      nameZh: "装裱宠物肖像 — 猫咪",
      nameEn: "Framed Pet Portrait — Cat",
      nameMs: "Potret Haiwan Berbingkai — Kucing",
      summaryZh: "装裱羊毛肖像，贴近猫咪的眼神与花纹。",
      summaryEn:
        "A framed wool portrait tailored to your cat’s gaze and coat pattern.",
      summaryMs:
        "Potret bulu berbingkai disesuaikan dengan pandangan dan corak bulu kucing anda.",
      descriptionZh:
        "从单色到复杂虎斑，我们仔细混色，让作品一眼就能认出是它。",
      descriptionEn:
        "From solid coats to intricate tabbies, we mix wool tones carefully so the likeness feels instantly familiar.",
      descriptionMs:
        "Dari bulu solid hingga tabby rumit, kami campur nada bulu dengan teliti supaya rupa terus dikenali.",
      priceFromUsd: 680,
      turnaroundMonths: "3–8",
      rating: 5,
      inStock: true,
      keywords: JSON.stringify(["cat", "猫", "portrait", "肖像", "framed"]),
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 1,
      variants: {
        create: [
          {
            id: "cat-solid",
            labelZh: "单色 / 双色",
            labelEn: "Solid & bicolor",
            labelMs: "Solid & dua warna",
            priceUsd: 680,
            sortOrder: 0,
          },
          {
            id: "cat-tabby",
            labelZh: "虎斑 / 三花",
            labelEn: "Tabby & tortie",
            labelMs: "Tabby & tortie",
            priceUsd: 780,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "mini-full",
      slug: "full-body-figurine",
      categoryId: miniature.id,
      saleType: SaleType.direct,
      nameZh: "全身微缩",
      nameEn: "Full Body Figurine",
      nameMs: "Figurin Badan Penuh",
      summaryZh: "立体微缩，连姿态与性格一起留下。",
      summaryEn:
        "A sculptural miniature of your pet, pose and personality included.",
      summaryMs: "Miniatur arca haiwan anda, termasuk pose dan personaliti.",
      descriptionZh:
        "针毡覆盖支撑骨架。可选可调爪子，收到后也能微调站姿。",
      descriptionEn:
        "Needle-felted over a supportive frame. Optional poseable paws let you adjust the stance after delivery.",
      descriptionMs:
        "Needle-felted atas rangka sokongan. Pilihan kaki boleh digayakan membolehkan anda ubah sikap selepas diterima.",
      priceFromUsd: 850,
      turnaroundMonths: "4–10",
      rating: 4.9,
      inStock: true,
      keywords: JSON.stringify([
        "dog",
        "犬",
        "狗",
        "figurine",
        "miniature",
        "迷你",
        "全身",
        "full body",
      ]),
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 0,
      variants: {
        create: [
          {
            id: "full-standard",
            labelZh: "标准款",
            labelEn: "Standard",
            labelMs: "Standard",
            priceUsd: 850,
            sortOrder: 0,
          },
          {
            id: "full-poseable",
            labelZh: "可调姿态爪子升级",
            labelEn: "Poseable paws upgrade",
            labelMs: "Naik taraf kaki boleh digayakan",
            priceUsd: 980,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "mini-small",
      slug: "mini-full-body-figurine",
      categoryId: miniature.id,
      saleType: SaleType.direct,
      nameZh: "迷你全身微缩（7–10 cm）",
      nameEn: "Mini Full Body Figurine (7–10 cm)",
      nameMs: "Figurin Badan Penuh Mini (7–10 cm)",
      summaryZh: "更小的全身纪念款，同样手工细节。",
      summaryEn:
        "A smaller full-body keepsake with the same handcrafted detail.",
      summaryMs:
        "Cenderamata badan penuh yang lebih kecil dengan perincian handmade yang sama.",
      descriptionZh:
        "适合桌面、书架与随身纪念——仍然一眼就是你家的它。",
      descriptionEn:
        "Perfect for desks, shelves, and travel-sized memories — still unmistakably your pet.",
      descriptionMs:
        "Sesuai untuk meja, rak, dan kenangan saiz perjalanan — tetap nyata seperti haiwan anda.",
      priceFromUsd: 500,
      turnaroundMonths: "3–7",
      rating: 4.9,
      inStock: true,
      keywords: JSON.stringify([
        "dog",
        "犬",
        "狗",
        "mini",
        "miniature",
        "迷你",
        "全身",
        "7cm",
        "10cm",
      ]),
      image:
        "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 1,
      variants: {
        create: [
          {
            id: "mini-7cm",
            labelZh: "7–10 cm",
            labelEn: "7–10 cm",
            labelMs: "7–10 cm",
            priceUsd: 500,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.heroSlide.createMany({
    data: [
      {
        image:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=80",
        titleZh: "它不只是宠物，是家人。",
        titleEn: "More than a pet — family.",
        titleMs: "Lebih daripada haiwan — keluarga.",
        bodyZh: "把日常的陪伴，做成可以触摸的温柔纪念。",
        bodyEn: "Turn everyday companionship into a keepsake you can hold.",
        bodyMs: "Ubah teman harian menjadi cenderamata yang boleh disentuh.",
        sortOrder: 0,
      },
      {
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=2000&q=80",
        titleZh: "羊毛里的温度，手工里的耐心。",
        titleEn: "Warmth in wool, patience in craft.",
        titleMs: "Kehangatan dalam bulu, kesabaran dalam kraftangan.",
        bodyZh: "每一缕毛色与眼神，都按你家的它来还原。",
        bodyEn: "Every fiber and gaze is shaped after your pet.",
        bodyMs: "Setiap serat dan pandangan dibentuk ikut haiwan anda.",
        sortOrder: 1,
      },
      {
        image:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2000&q=80",
        titleZh: "一眼认出，是它回来了。",
        titleEn: "One look — it’s them again.",
        titleMs: "Sekilas pandang — itu dia semula.",
        bodyZh: "肖像与迷你全身，适合纪念日、生日与长久珍藏。",
        bodyEn:
          "Portraits and miniatures for milestones, birthdays, and forever.",
        bodyMs:
          "Potret dan miniatur untuk ulang tahun, peringatan, dan kenangan abadi.",
        sortOrder: 2,
      },
    ],
  });

  console.log("[seed] categories, products, hero slides created");
  console.log("  portrait → custom (featured)");
  console.log("  miniature → direct (grid)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
