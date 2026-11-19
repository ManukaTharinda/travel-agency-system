
"use client";

import { Save, FileCheck, Loader2 } from "lucide-react";
import type { DocumentType } from "./document-types";

interface DocumentFormActionsProps {
  documentType: DocumentType;
  isSaving: boolean;
  onSaveDraft: () => void;
  onCreateDocument: () => void;
}

export function DocumentFormActions({
  documentType,
  isSaving,
  onSaveDraft,
  onCreateDocument,
}: DocumentFormActionsProps) {
  const documentLabel =
    documentType === "quotation" ? "Quotation" : "Invoice";

  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
        <p className="hidden text-xs text-slate-500 dark:text-slate-400 md:block">
          Review all information before creating your {documentLabel.toLowerCase()}.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save as Draft
          </button>

          <button
            type="button"
            onClick={onCreateDocument}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileCheck className="h-4 w-4" />
            )}

            {isSaving
              ? "Saving..."
              : `Create ${documentLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}
