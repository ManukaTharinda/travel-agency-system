
"use client";

import { Loader2, Save, Send, RotateCcw } from "lucide-react";

interface QuotationFormActionsProps {
  isSaving: boolean;
  onSaveDraft: () => void;
  onSaveAndSend: () => void;
  onCancel: () => void;
}

export default function QuotationFormActions({
  isSaving,
  onSaveDraft,
  onSaveAndSend,
  onCancel,
}: QuotationFormActionsProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={16} />
          Cancel
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save as Draft
          </button>

          <button
            type="button"
            onClick={onSaveAndSend}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
