
export type DocumentType = "quotation" | "invoice";

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "CONFIRMED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface DocumentCustomer {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality?: string | null;
  address?: string | null;
}

export interface DocumentItinerary {
  id: string;
  customerId: string;
  referenceCode: string | null;
  title: string;
  destination: string | null;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
}

export interface DocumentLineItem {
  id: string;
  category: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface DocumentTotals {
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface QuotationFormData {
  customerId: string;
  itineraryId: string;
  issueDate: string;
  validUntil: string;
  currencyCode: string;
  items: DocumentLineItem[];
  discount: number;
  taxRate: number;
  notes: string;
  terms: string;
}

export interface InvoiceFormData {
  customerId: string;
  quotationId: string | null;
  itineraryId: string | null;
  issueDate: string;
  dueDate: string;
  currencyCode: string;
  items: DocumentLineItem[];
  discount: number;
  taxRate: number;
  amountPaid: number;
  notes: string;
  paymentTerms: string;
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string;
  status: QuotationStatus;
  customerName: string;
  customerEmail: string | null;
  issueDate: string;
  validUntil: string;
  currencyCode: string;
  totalAmount: number;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  customerName: string;
  customerEmail: string | null;
  issueDate: string;
  dueDate: string | null;
  currencyCode: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  createdAt: string;
}

export const defaultDocumentLineItem = (
  id: string = "initial-line-item"
): DocumentLineItem => ({
  id,
  category: "OTHER",
  name: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  lineTotal: 0,
});

export const defaultQuotationForm: QuotationFormData = {
  customerId: "",
  itineraryId: "",
  issueDate: "",
  validUntil: "",
  currencyCode: "LKR",
  items: [defaultDocumentLineItem()],
  discount: 0,
  taxRate: 0,
  notes: "",
  terms: "",
};

export const defaultInvoiceForm: InvoiceFormData = {
  customerId: "",
  quotationId: null,
  itineraryId: null,
  issueDate: "",
  dueDate: "",
  currencyCode: "LKR",
  items: [defaultDocumentLineItem()],
  discount: 0,
  taxRate: 0,
  amountPaid: 0,
  notes: "",
  paymentTerms: "",
};
