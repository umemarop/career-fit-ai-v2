"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { normalizeApiError } from "@/utils/api-error";
import type { RegisterFormInput } from "@/types/auth.types";

export function RegisterForm() {
  const [form, setForm] = useState<RegisterFormInput>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof RegisterFormInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    if (!form.password) {
      setErrorMessage("Password is required.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(form.password)) {
      setErrorMessage("Password must include at least one uppercase letter.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await authService.register({
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      console.log("Register success:", result);

      setSuccessMessage(
        "Account created successfully. Please check your email to verify your account.",
      );
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Create your account
        </h1>
        <p className="text-sm text-slate-600">
          Start building your career system with CareerFit AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Create a password"
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-950"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Use at least 8 characters and one uppercase letter.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) =>
                handleChange("confirmPassword", event.target.value)
              }
              placeholder="Confirm your password"
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-950"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-slate-950 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
