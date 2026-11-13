-- AlterTable
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentProvider" TEXT NOT NULL DEFAULT 'stripe',
    "stripeSessionId" TEXT,
    "paypalOrderId" TEXT,
    "amountTotal" INTEGER,
    "currency" TEXT,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "shippingJson" TEXT,
    "itemsJson" TEXT NOT NULL DEFAULT '[]',
    "locale" TEXT,
    "invoiceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'awaiting_photos',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("id", "paymentProvider", "stripeSessionId", "paypalOrderId", "amountTotal", "currency", "customerEmail", "customerName", "shippingJson", "itemsJson", "locale", "invoiceId", "status", "createdAt", "updatedAt")
SELECT "id", 'stripe', "stripeSessionId", NULL, "amountTotal", "currency", "customerEmail", "customerName", "shippingJson", "itemsJson", "locale", "invoiceId", "status", "createdAt", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
CREATE UNIQUE INDEX "Order_paypalOrderId_key" ON "Order"("paypalOrderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
