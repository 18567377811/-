"use client";

import { useEffect, useState } from "react";

export type AdminToastTone = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  tone: AdminToastTone;
};

type Listener = (items: ToastItem[]) => void;

let nextId = 1;
let queue: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  const snapshot = [...queue];
  listeners.forEach((listener) => listener(snapshot));
}

function push(message: string, tone: AdminToastTone) {
  const id = nextId++;
  queue = [...queue.slice(-2), { id, message, tone }];
  emit();
  window.setTimeout(() => {
    queue = queue.filter((item) => item.id !== id);
    emit();
  }, 2400);
}

export const adminToast = {
  show(message: string, tone: AdminToastTone = "info") {
    push(message, tone);
  },
  success(message: string) {
    push(message, "success");
  },
  error(message: string) {
    push(message, "error");
  },
  info(message: string) {
    push(message, "info");
  },
};

function ToastGlyph({ tone }: { tone: AdminToastTone }) {
  if (tone === "success") {
    return (
      <span className="admin-toast-glyph admin-toast-glyph-success" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6.5 12.5 10.2 16 17.5 8.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (tone === "error") {
    return (
      <span className="admin-toast-glyph admin-toast-glyph-error" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M8 8l8 8M16 8l-8 8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="admin-toast-glyph admin-toast-glyph-info" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8.2v.01M12 11v5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function AdminToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setItems);
    setItems([...queue]);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="admin-toast-host" aria-live="polite" aria-relevant="additions">
      {items.map((item) => (
        <div
          key={item.id}
          className="admin-toast"
          data-tone={item.tone}
          role={item.tone === "error" ? "alert" : "status"}
        >
          <ToastGlyph tone={item.tone} />
          <span className="admin-toast-text">{item.message}</span>
        </div>
      ))}
    </div>
  );
}
