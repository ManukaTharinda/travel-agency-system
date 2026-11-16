
"use client";

import { useState } from "react";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full rounded-lg border border-slate-300 px-4 py-3 pr-16 outline-none focus:border-blue-500 ${props.className ?? ""}`}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600"
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
}
