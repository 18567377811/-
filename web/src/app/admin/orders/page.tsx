"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { IconChevron } from "@/components/admin/icons";
import {
  EmptyState,
  Field,
  ListCard,
  Section,
  Select,
  Sheet,
  Thumb,
} from "@/components/admin/ui";
import {
  COMMISSION_STATUSES,
  STYLE_OPTIONS,
  TIMING_OPTIONS,
  labelForOption,
} from "@/lib/commission-options";

const STATUS_LABELS: Record<string, string> = {
  paid: "已付款",
  awaiting_photos: "待传照片",
  in_production: "制作中",
  preview_sent: "已发预览",
  revision: "修改中",
  approved: "已确认",
  shipped: "已发货",
  completed: "已完成",
};

const COMMISSION_STATUS_LABELS = Object.fromEntries(
  COMMISSION_STATUSES.map((item) => [item.value, item.label]),
) as Record<string, string>;

type Order = {
  id: string;
  stripeSessionId: string;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  customerName: string | null;
  shippingJson: string | null;
  itemsJson: string;
  locale: string | null;
  invoiceId: string | null;
  status: string;
  createdAt: string;
};

type ProductLite = { id: string; image: string; nameZh: string };

type Commission = {
  id: string;
  productId: string | null;
  productName: string | null;
  productSlug: string | null;
  fullName: string;
  email: string;
  country: string;
  petName: string;
  petBreed: string;
  petDescription: string;
  preferredStyle: string;
  timing: string;
  questions: string;
  status: string;
  photosJson: string;
  locale: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [selectedCommission, setSelectedCommission] =
    useState<Commission | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"orders" | "commissions">("orders");

  const productMap = useMemo(() => {
    const map = new Map<string, ProductLite>();
    for (const product of products) map.set(product.id, product);
    return map;
  }, [products]);

  const load = useCallback(async () => {
    const [oRes, pRes, cRes] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/products"),
      fetch("/api/admin/commissions"),
    ]);
    if (oRes.ok) {
      const data = (await oRes.json()) as { orders: Order[] };
      setOrders(data.orders);
    }
    if (pRes.ok) {
      const data = (await pRes.json()) as {
        products: ProductLite[];
      };
      setProducts(
        data.products.map((p) => ({
          id: p.id,
          image: p.image,
          nameZh: p.nameZh,
        })),
      );
    }
    if (cRes.ok) {
      const data = (await cRes.json()) as { commissions: Commission[] };
      setCommissions(data.commissions);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function orderThumb(order: Order) {
    try {
      const items = JSON.parse(order.itemsJson || "[]") as Array<{
        productId?: string;
      }>;
      const first = items[0]?.productId;
      return first ? productMap.get(first)?.image : undefined;
    } catch {
      return undefined;
    }
  }

  function commissionPhotos(row: Commission) {
    try {
      return JSON.parse(row.photosJson || "[]") as string[];
    } catch {
      return [];
    }
  }

  async function updateStatus(status: string) {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        window.alert(data.error || "更新失败");
        return;
      }
      const data = (await res.json()) as { order: Order };
      setSelected(data.order);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function updateCommissionStatus(status: string) {
    if (!selectedCommission) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/commissions/${selectedCommission.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        window.alert(data.error || "更新失败");
        return;
      }
      const data = (await res.json()) as { commission: Commission };
      setSelectedCommission(data.commission);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function formatMoney(order: Order) {
    if (order.amountTotal == null) return "—";
    return `${(order.currency ?? "usd").toUpperCase()} ${(
      order.amountTotal / 100
    ).toFixed(2)}`;
  }

  let items: unknown[] = [];
  try {
    items = JSON.parse(selected?.itemsJson || "[]") as unknown[];
  } catch {
    items = [];
  }

  const commissionLocale = selectedCommission?.locale || "zh";
  const commissionPhotoList = selectedCommission
    ? commissionPhotos(selectedCommission)
    : [];

  return (
    <AdminShell title="订单">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-[var(--ios-fill)] p-1">
        <button
          type="button"
          className={`rounded-xl px-3 py-2 text-sm font-semibold ${
            tab === "orders"
              ? "bg-white text-[var(--ios-label)] shadow-sm"
              : "text-[var(--ios-secondary)]"
          }`}
          onClick={() => setTab("orders")}
        >
          付款订单
        </button>
        <button
          type="button"
          className={`rounded-xl px-3 py-2 text-sm font-semibold ${
            tab === "commissions"
              ? "bg-white text-[var(--ios-label)] shadow-sm"
              : "text-[var(--ios-secondary)]"
          }`}
          onClick={() => setTab("commissions")}
        >
          定制委托
        </button>
      </div>

      {tab === "orders" ? (
        orders.length === 0 ? (
          <EmptyState text="暂无付款订单。" />
        ) : (
          <ListCard>
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                className="admin-row w-full text-left"
                onClick={() => setSelected(order)}
              >
                <Thumb src={orderThumb(order)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">
                    {order.customerName || order.customerEmail || "匿名客户"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--ios-secondary)]">
                    {STATUS_LABELS[order.status] ?? order.status} ·{" "}
                    {formatMoney(order)}
                  </p>
                </div>
                <IconChevron className="h-4 w-4 text-[var(--ios-secondary)]" />
              </button>
            ))}
          </ListCard>
        )
      ) : commissions.length === 0 ? (
        <EmptyState text="暂无定制委托申请。" />
      ) : (
        <ListCard>
          {commissions.map((row) => (
            <button
              key={row.id}
              type="button"
              className="admin-row w-full text-left"
              onClick={() => setSelectedCommission(row)}
            >
              <Thumb src={commissionPhotos(row)[0]} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">
                  {row.fullName}
                </p>
                <p className="mt-0.5 text-xs text-[var(--ios-secondary)]">
                  {COMMISSION_STATUS_LABELS[row.status] ?? row.status} ·{" "}
                  {row.productName || row.productSlug || "定制"} ·{" "}
                  {row.petName || "未填宠物名"}
                </p>
              </div>
              <IconChevron className="h-4 w-4 text-[var(--ios-secondary)]" />
            </button>
          ))}
        </ListCard>
      )}

      <Sheet
        open={Boolean(selected)}
        title="订单详情"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <Section title="客户">
              <div>
                <p className="text-[17px] font-semibold">
                  {selected.customerName || "—"}
                </p>
                <p className="mt-1 text-sm text-[var(--ios-secondary)]">
                  {selected.customerEmail || "无邮箱"}
                </p>
                <p className="mt-3 text-xl font-semibold">
                  {formatMoney(selected)}
                </p>
              </div>
            </Section>
            <Section title="履约状态">
              <Field label="状态">
                <Select
                  value={selected.status}
                  onChange={(status) => {
                    if (!saving) void updateStatus(status);
                  }}
                  options={Object.entries(STATUS_LABELS).map(
                    ([value, label]) => ({ value, label }),
                  )}
                />
              </Field>
            </Section>
            <Section title="商品行">
              <pre className="overflow-auto rounded-xl bg-[var(--ios-fill-soft)] p-3 text-xs text-[var(--ios-secondary)]">
                {JSON.stringify(items, null, 2)}
              </pre>
            </Section>
          </>
        ) : null}
      </Sheet>

      <Sheet
        open={Boolean(selectedCommission)}
        title="委托详情"
        onClose={() => setSelectedCommission(null)}
      >
        {selectedCommission ? (
          <>
            <Section title="申请人">
              <div className="space-y-1 text-sm">
                <p className="text-[17px] font-semibold">
                  {selectedCommission.fullName}
                </p>
                <p className="text-[var(--ios-secondary)]">
                  {selectedCommission.email}
                </p>
                <p className="text-[var(--ios-secondary)]">
                  {selectedCommission.country || "未填国家"} ·{" "}
                  {selectedCommission.locale || "—"}
                </p>
                <p className="text-[var(--ios-secondary)]">
                  {new Date(selectedCommission.createdAt).toLocaleString()}
                </p>
              </div>
            </Section>

            <Section title="关联商品">
              <p className="text-sm font-medium">
                {selectedCommission.productName ||
                  selectedCommission.productSlug ||
                  "未关联"}
              </p>
            </Section>

            <Section title="宠物信息">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-[var(--ios-secondary)]">名字：</span>
                  {selectedCommission.petName || "—"}
                </p>
                <p>
                  <span className="text-[var(--ios-secondary)]">品种：</span>
                  {selectedCommission.petBreed || "—"}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  <span className="text-[var(--ios-secondary)]">介绍：</span>
                  {selectedCommission.petDescription || "—"}
                </p>
              </div>
            </Section>

            <Section title="偏好">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-[var(--ios-secondary)]">风格：</span>
                  {labelForOption(
                    STYLE_OPTIONS,
                    selectedCommission.preferredStyle,
                    commissionLocale,
                  )}
                </p>
                <p>
                  <span className="text-[var(--ios-secondary)]">时间：</span>
                  {labelForOption(
                    TIMING_OPTIONS,
                    selectedCommission.timing,
                    commissionLocale,
                  )}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  <span className="text-[var(--ios-secondary)]">问题：</span>
                  {selectedCommission.questions || "—"}
                </p>
              </div>
            </Section>

            <Section title="宠物照片">
              {commissionPhotoList.length === 0 ? (
                <p className="text-sm text-[var(--ios-secondary)]">无照片</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {commissionPhotoList.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-square overflow-hidden rounded-xl bg-[var(--ios-fill)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </Section>

            <Section title="处理状态">
              <Field label="状态">
                <Select
                  value={selectedCommission.status}
                  onChange={(status) => {
                    if (!saving) void updateCommissionStatus(status);
                  }}
                  options={COMMISSION_STATUSES.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                />
              </Field>
            </Section>
          </>
        ) : null}
      </Sheet>
    </AdminShell>
  );
}
