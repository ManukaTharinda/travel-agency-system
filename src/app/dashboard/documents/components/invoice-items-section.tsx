
"use client";

import { Plus, Trash2, Package, Calculator, ChevronDown } from "lucide-react";
import type { DocumentLineItem } from "./document-types";

interface InvoiceItemsSectionProps {
  items: DocumentLineItem[];
  currencyCode: string;
  onChange: (items: DocumentLineItem[]) => void;
}

const services = [
  "Tour Package",
  "Accommodation",
  "Transportation",
  "Airport Transfer",
  "Tour Guide",
  "Safari",
  "Sightseeing & Excursions",
  "Meals",
  "Entrance Tickets",
  "Other Services",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InvoiceItemsSection({
  items,
  currencyCode,
  onChange,
}: InvoiceItemsSectionProps) {
  const updateItem = (
    id: string,
    field: "name" | "description" | "quantity" | "unitPrice" | "category",
    value: string | number
  ) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = {
          ...item,
          [field]: value,
        };

        if (field === "quantity" || field === "unitPrice") {
          updatedItem.lineTotal =
            Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }

        return updatedItem;
      })
    );
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <Package size={18} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Invoice Items
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Add services, quantities and unit prices.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Item {index + 1}
              </span>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                title="Remove item"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-950/30"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Select Service *
                </label>

                <div className="relative">
                  <select
                    value={item.category}
                    onChange={(event) => {
                      const selectedService = services.find(
                        (service) =>
                          service.toUpperCase().replace(/[^A-Z0-9]+/g, "_") ===
                          event.target.value
                      );

                      updateItem(item.id, "category", event.target.value);

                      if (selectedService) {
                        updateItem(item.id, "name", selectedService);
                      }
                    }}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="">Choose a service</option>

                    {services.map((service) => {
                      const value = service
                        .toUpperCase()
                        .replace(/[^A-Z0-9]+/g, "_");

                      return (
                        <option key={value} value={value}>
                          {service}
                        </option>
                      );
                    })}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Item Name *
                </label>

                <input
                  type="text"
                  value={item.name}
                  onChange={(event) =>
                    updateItem(item.id, "name", event.target.value)
                  }
                  placeholder="Enter item name"
                  maxLength={200}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Description
                </label>

                <textarea
                  value={item.description}
                  onChange={(event) =>
                    updateItem(item.id, "description", event.target.value)
                  }
                  placeholder="Enter service details..."
                  rows={2}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Quantity *
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "quantity",
                        Math.max(0, Number(event.target.value))
                      )
                    }
                    className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Unit Price ({currencyCode}) *
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
                    placeholder="Enter price"
                    className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Line Total
              </span>

              <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                {formatMoney(item.lineTotal, currencyCode)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-blue-200/70 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Calculator size={17} className="text-blue-600 dark:text-blue-400" />
          Subtotal
        </div>

        <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
          {formatMoney(subtotal, currencyCode)}
        </span>
      </div>
    </section>
  );
}
