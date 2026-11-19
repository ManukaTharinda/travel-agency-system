
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  UserRound,
  FileText,
  Search,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

interface CustomerOption {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
}

interface BasicInformation {
  customerId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  referenceCode: string;
}

interface BasicInformationSectionProps {
  customers: CustomerOption[];
  values: BasicInformation;
  onChange: (field: keyof BasicInformation, value: string | number) => void;
  loadingCustomers?: boolean;
}

export default function BasicInformationSection({
  customers,
  values,
  onChange,
  loadingCustomers = false,
}: BasicInformationSectionProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

  const selectedCustomer = customers.find(
    (customer) => customer.id === values.customerId
  );

  const selectedCustomerName = selectedCustomer
    ? [selectedCustomer.firstName, selectedCustomer.lastName]
        .filter(Boolean)
        .join(" ")
    : "";

  // Keep the search field synchronized with the selected customer.
  useEffect(() => {
    setCustomerSearch(selectedCustomerName);
  }, [selectedCustomerName]);

  // Search customers by name, email and phone.
  const filteredCustomers = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();

    if (!search) return customers;

    return customers.filter((customer) => {
      const fullName = [
        customer.firstName,
        customer.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        fullName.includes(search) ||
        (customer.email || "").toLowerCase().includes(search) ||
        (customer.phone || "").toLowerCase().includes(search)
      );
    });
  }, [customers, customerSearch]);

  const handleCustomerSelect = (customer: CustomerOption) => {
    const fullName = [
      customer.firstName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    onChange("customerId", customer.id);
    setCustomerSearch(fullName);
    setCustomerDropdownOpen(false);
  };

  const handleCustomerClear = () => {
    onChange("customerId", "");
    setCustomerSearch("");
    setCustomerDropdownOpen(true);
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10";

  const labelClass =
    "mb-2 block text-xs font-medium text-foreground";

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">

      {/* Section Heading */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          <FileText className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Basic Travel Information
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter the main details of your customer's journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Searchable Customer Selection */}
        <div className="relative md:col-span-2">
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-blue-400" />
              Select Customer <span className="text-rose-500">*</span>
            </span>
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={customerSearch}
              onChange={(event) => {
                setCustomerSearch(event.target.value);
                setCustomerDropdownOpen(true);

                if (values.customerId) {
                  onChange("customerId", "");
                }
              }}
              onFocus={() => setCustomerDropdownOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setCustomerDropdownOpen(false);
                }
              }}
              disabled={loadingCustomers}
              placeholder={
                loadingCustomers
                  ? "Loading customers..."
                  : "Search customer by name, email or phone..."
              }
              className={`${inputClass} pl-10 pr-10`}
              autoComplete="off"
              aria-label="Search customers"
              aria-expanded={customerDropdownOpen}
              aria-controls="customer-search-results"
            />

            {customerSearch && !loadingCustomers ? (
              <button
                type="button"
                onClick={handleCustomerClear}
                aria-label="Clear selected customer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
          </div>

          {/* Customer Dropdown */}
          {customerDropdownOpen && !loadingCustomers && customers.length > 0 && (
            <>
              <button
                type="button"
                aria-label="Close customer dropdown"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setCustomerDropdownOpen(false)}
              />

              <div
                id="customer-search-results"
                className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-border bg-[#080D19] p-1 shadow-2xl"
              >
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => {
                    const fullName = [
                      customer.firstName,
                      customer.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    const isSelected = customer.id === values.customerId;

                    return (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => handleCustomerSelect(customer)}
                        className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition ${
                          isSelected
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-foreground hover:bg-[#10192D]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {fullName}
                          </p>

                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {[customer.email, customer.phone]
                              .filter(Boolean)
                              .join(" · ") || "No contact information"}
                          </p>
                        </div>

                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-blue-400" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No matching customers found.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Customer Loading / Empty State */}
          {!loadingCustomers && customers.length === 0 && (
            <p className="mt-2 text-xs text-amber-400">
              No active customers found. Please add a customer before creating an itinerary.
            </p>
          )}

          {/* Selected Customer */}
          {selectedCustomer && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
              <Check className="h-4 w-4 shrink-0 text-blue-400" />
              <p className="text-xs text-blue-300">
                Selected: {selectedCustomerName}
              </p>
            </div>
          )}
        </div>

        {/* Itinerary Title */}
        <div>
          <label className={labelClass}>
            Itinerary Title <span className="text-rose-500">*</span>
          </label>

          <input
            type="text"
            value={values.title}
            onChange={(event) =>
              onChange("title", event.target.value)
            }
            placeholder="e.g. Sri Lanka Family Adventure"
            className={inputClass}
            maxLength={150}
            required
          />
        </div>

        {/* Reference Code */}
        <div>
          <label className={labelClass}>Reference Code</label>

          <input
            type="text"
            value={values.referenceCode}
            onChange={(event) =>
              onChange("referenceCode", event.target.value)
            }
            placeholder="e.g. MT-2026-001"
            className={inputClass}
            maxLength={50}
          />
        </div>

        {/* Destination */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              Destination
            </span>
          </label>

          <input
            type="text"
            value={values.destination}
            onChange={(event) =>
              onChange("destination", event.target.value)
            }
            placeholder="e.g. Colombo, Kandy, Ella, Galle"
            className={inputClass}
            maxLength={150}
          />
        </div>

        {/* Start Date */}
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-400" />
              Start Date <span className="text-rose-500">*</span>
            </span>
          </label>

          <input
            type="date"
            value={values.startDate}
            onChange={(event) =>
              onChange("startDate", event.target.value)
            }
            className={inputClass}
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-400" />
              End Date <span className="text-rose-500">*</span>
            </span>
          </label>

          <input
            type="date"
            value={values.endDate}
            onChange={(event) =>
              onChange("endDate", event.target.value)
            }
            min={values.startDate || undefined}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Guest Information */}
      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-foreground">
            Guest Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div>
            <label className={labelClass}>Adults</label>
            <input
              type="number"
              min={1}
              max={100}
              value={values.adults}
              onChange={(event) =>
                onChange("adults", Number(event.target.value))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Children</label>
            <input
              type="number"
              min={0}
              max={100}
              value={values.children}
              onChange={(event) =>
                onChange("children", Number(event.target.value))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Infants</label>
            <input
              type="number"
              min={0}
              max={100}
              value={values.infants}
              onChange={(event) =>
                onChange("infants", Number(event.target.value))
              }
              className={inputClass}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Total guests:{" "}
          <span className="font-semibold text-foreground">
            {values.adults + values.children + values.infants}
          </span>
        </p>
      </div>
    </section>
  );
}
