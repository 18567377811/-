-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "siteTitle" TEXT NOT NULL DEFAULT 'Feltora',
    "themeAccent" TEXT NOT NULL DEFAULT '#9a5b45',
    "policyRefundZh" TEXT NOT NULL DEFAULT '',
    "policyRefundEn" TEXT NOT NULL DEFAULT '',
    "policyRefundMs" TEXT NOT NULL DEFAULT '',
    "policyShippingZh" TEXT NOT NULL DEFAULT '',
    "policyShippingEn" TEXT NOT NULL DEFAULT '',
    "policyShippingMs" TEXT NOT NULL DEFAULT '',
    "policyTermsZh" TEXT NOT NULL DEFAULT '',
    "policyTermsEn" TEXT NOT NULL DEFAULT '',
    "policyTermsMs" TEXT NOT NULL DEFAULT '',
    "policyCareZh" TEXT NOT NULL DEFAULT '',
    "policyCareEn" TEXT NOT NULL DEFAULT '',
    "policyCareMs" TEXT NOT NULL DEFAULT '',
    "photoGuideTitleZh" TEXT NOT NULL DEFAULT '拍照指南',
    "photoGuideTitleEn" TEXT NOT NULL DEFAULT 'Photo Guide',
    "photoGuideTitleMs" TEXT NOT NULL DEFAULT 'Panduan Foto',
    "photoGuideIntroZh" TEXT NOT NULL DEFAULT '',
    "photoGuideIntroEn" TEXT NOT NULL DEFAULT '',
    "photoGuideIntroMs" TEXT NOT NULL DEFAULT '',
    "photoGuideTipsJson" TEXT NOT NULL DEFAULT '[]',
    "processTitleZh" TEXT NOT NULL DEFAULT '一起把性格做活',
    "processTitleEn" TEXT NOT NULL DEFAULT 'Bring their character to life',
    "processTitleMs" TEXT NOT NULL DEFAULT 'Hidupkan personaliti mereka',
    "processBodyZh" TEXT NOT NULL DEFAULT '',
    "processBodyEn" TEXT NOT NULL DEFAULT '',
    "processBodyMs" TEXT NOT NULL DEFAULT '',
    "processStepsJson" TEXT NOT NULL DEFAULT '[]',
    "faqJson" TEXT NOT NULL DEFAULT '[]',
    "socialJson" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CommissionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "productSlug" TEXT,
    "productName" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT '',
    "petName" TEXT NOT NULL DEFAULT '',
    "petBreed" TEXT NOT NULL DEFAULT '',
    "petDescription" TEXT NOT NULL DEFAULT '',
    "preferredStyle" TEXT NOT NULL DEFAULT '',
    "timing" TEXT NOT NULL DEFAULT '',
    "questions" TEXT NOT NULL DEFAULT '',
    "photosJson" TEXT NOT NULL DEFAULT '[]',
    "locale" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "saleType" TEXT NOT NULL DEFAULT 'custom',
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMs" TEXT NOT NULL,
    "summaryZh" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "summaryMs" TEXT NOT NULL DEFAULT '',
    "descriptionZh" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionMs" TEXT NOT NULL DEFAULT '',
    "priceFromUsd" REAL NOT NULL,
    "turnaroundMonths" TEXT NOT NULL,
    "rating" REAL,
    "image" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "keywords" TEXT NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "descriptionEn", "descriptionMs", "descriptionZh", "id", "image", "inStock", "isActive", "keywords", "nameEn", "nameMs", "nameZh", "priceFromUsd", "rating", "slug", "sortOrder", "summaryEn", "summaryMs", "summaryZh", "turnaroundMonths", "updatedAt") SELECT "categoryId", "createdAt", "descriptionEn", "descriptionMs", "descriptionZh", "id", "image", "inStock", "isActive", "keywords", "nameEn", "nameMs", "nameZh", "priceFromUsd", "rating", "slug", "sortOrder", "summaryEn", "summaryMs", "summaryZh", "turnaroundMonths", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
