
"use client";

import { Plus, Trash2, Package, Calculator } from "lucide-react";
import type { DocumentLineItem } from "./document-types";

interface DocumentItemsSectionProps {
  items: DocumentLineItem[];
  currencyCode: string;
  onChange: (items: DocumentLineItem[]) => void;
}

const categories = [
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transportation" },
  { value: "ACTIVITY", label: "Activities & Excursions" },
  { value: "GUIDE", label: "Tour Guide" },
  { value: "MEALS", label: "Meals" },
  { value: "ENTRANCE", label: "Entrance Tickets" },
  { value: "OTHER", label: "Other Services" },
];

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function DocumentItemsSection({
  items,
  currencyCode,
  onChange,
}: DocumentItemsSectionProps) {
  const updateItem = (
    id: string,
    field: keyof DocumentLineItem,
    value: string | number
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id !== id) return item;

      const updatedItem = {
        ...item,
        [field]: value,
      };

      if (field === "quantity" || field === "unitPrice") {
        const quantity =
          field === "quantity" ? Number(value) : updatedItem.quantity;

        const unitPrice =
          field === "unitPrice" ? Number(value) : updatedItem.unitPrice;

        updatedItem.lineTotal =
          Math.max(0, quantity) * Math.max(0, unitPrice);
      }

      return updatedItem;
    });

    onChange(updatedItems);
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        category: "OTHER",
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        lineTotal: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;

    onChange(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <Package className="h-4 w-4 text-blue-500" />
            Services & Line Items
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add the travel services included in this document.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Service {index + 1}
              </p>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                aria-label={`Remove service ${index + 1}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Service Category
                </label>

                <select
                  value={item.category}
                  onChange={(event) =>
                    updateItem(item.id, "category", event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Service Name
                </label>

                <input
                  type="text"
                  value={item.name}
                  onChange={(event) =>
                    updateItem(item.id, "name", event.target.value)
                  }
                  placeholder="e.g. Airport Transfer"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={item.description}
                  onChange={(event) =>
                    updateItem(item.id, "description", event.target.value)
                  }
                  rows={2}
                  placeholder="Add details about this service..."
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "quantity",
                      Math.max(0, Number(event.target.value))
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Unit Price ({currencyCode})
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "unitPrice",
                      Math.max(0, Number(event.target.value))
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Line Total
              </span>

              <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                {formatCurrency(item.lineTotal, currencyCode)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-200/70 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Subtotal
          </span>
        </div>

        <span className="text-base font-bold tabular-nums text-blue-700 dark:text-blue-300">
          {formatCurrency(subtotal, currencyCode)}
        </span>
      </div>
    </section>
  );
}
