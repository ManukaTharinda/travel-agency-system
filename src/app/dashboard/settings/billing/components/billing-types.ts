
export type DocumentType = "invoice" | "quotation";

export interface BillingSettings {
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;

  paymentInstructions: string;
  defaultPaymentTerms: string;

  defaultTaxRate: string;
  taxRegistrationNumber: string;

  quotationValidityDays: number;
  quotationTerms: string;
}

export const defaultBillingSettings: BillingSettings = {
  bankName: "",
  bankBranch: "",
  accountName: "",
  accountNumber: "",
  swiftCode: "",

  paymentInstructions: "",
  defaultPaymentTerms: "Payment due within 7 days",

  defaultTaxRate: "0",
  taxRegistrationNumber: "",

  quotationValidityDays: 14,
  quotationTerms: "",
};
