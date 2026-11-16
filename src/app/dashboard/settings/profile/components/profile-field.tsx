
import type { ElementType } from "react";

interface ProfileFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  icon?: ElementType;
}

export function ProfileField({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
  icon: Icon,
}: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && (
          <span className="ml-1 text-blue-600">*</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          type={type}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${
            Icon ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
}
