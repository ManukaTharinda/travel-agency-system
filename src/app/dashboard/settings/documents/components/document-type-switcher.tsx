"use client";

import { FileText, Receipt } from "lucide-react";
import type { DocumentType } from "./document-types";

interface DocumentTypeSwitcherProps {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
}

export function DocumentTypeSwitcher({
  value,
  onChange,
}: DocumentTypeSwitcherProps) {
  const options = [
    {
      id: "quotation" as const,
      label: "Quotation",
      description: "Prepare a price proposal",
      icon: FileText,
    },
    {
      id: "invoice" as const,
      label: "Invoice",
      description: "Create a payment document",
      icon: Receipt,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                isActive
                  ? "border-blue-500/30 bg-blue-50 shadow-sm dark:border-blue-400/30 dark:bg-blue-500/10"
                  : "border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/70"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {option.label}
                </p>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}