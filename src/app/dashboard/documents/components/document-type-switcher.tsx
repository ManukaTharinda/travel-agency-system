
"use client";

import { FileText, Receipt } from "lucide-react";
import type { DocumentType } from "./document-types";

interface DocumentTypeSwitcherProps {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
}

export default function DocumentTypeSwitcher({
  value,
  onChange,
}: DocumentTypeSwitcherProps) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950/60">
      <button
        type="button"
        onClick={() => onChange("quotation")}
        className={`flex items-center justify-center gap-3 rounded-xl px-4 py-4 text-sm font-semibold transition ${
          value === "quotation"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        <FileText size={19} />
        Quotation
      </button>

      <button
        type="button"
        onClick={() => onChange("invoice")}
        className={`flex items-center justify-center gap-3 rounded-xl px-4 py-4 text-sm font-semibold transition ${
          value === "invoice"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        <Receipt size={19} />
        Invoice
      </button>
    </div>
  );
}
