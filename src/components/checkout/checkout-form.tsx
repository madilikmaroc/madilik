"use client";

import { useState } from "react";

import { useLanguage } from "@/contexts/language-context";
import { CheckoutField } from "./checkout-field";
import { CheckoutSection } from "./checkout-section";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  location: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  location?: string;
}

function getValidateForm(t: (k: string) => string) {
  return (data: CheckoutFormData): FormErrors => {
    const errors: FormErrors = {};
    const fullName = data.fullName.trim();
    const phoneRaw = data.phone.trim();
    const location = data.location.trim();

    if (!fullName || fullName.length < 2) errors.fullName = t("validation.fullName");

    const digitsOnly = phoneRaw.replace(/[^\d]/g, "");
    if (!digitsOnly || digitsOnly.length < 8 || digitsOnly.length > 15) {
      errors.phone = t("validation.phone");
    }

    if (!location || location.length < 4) errors.location = t("validation.location");
    return errors;
  };
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting = false }: CheckoutFormProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormData, boolean>>>({});
  const validateForm = getValidateForm(t);

  const handleChange = (field: keyof CheckoutFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof CheckoutFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateForm(values);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(values);
    setErrors(formErrors);
    setTouched({ fullName: true, phone: true, location: true });

    if (Object.keys(formErrors).length === 0) {
      onSubmit(values);
    }
  };

  const showError = (field: keyof FormErrors): string | undefined =>
    touched[field as keyof CheckoutFormData] && errors[field] ? errors[field] : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-muted-foreground">{t("checkout.codNote")}</p>

      <CheckoutSection title={t("checkout.formTitle")}>
        <div className="space-y-4">
          <CheckoutField
            label={t("checkout.fullName")}
            value={values.fullName}
            onChange={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            error={showError("fullName")}
            required
            autoComplete="name"
          />
          <CheckoutField
            label={t("checkout.phone")}
            type="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            onBlur={handleBlur("phone")}
            error={showError("phone")}
            required
            autoComplete="tel"
          />
          <CheckoutField
            label={t("checkout.location")}
            value={values.location}
            onChange={handleChange("location")}
            onBlur={handleBlur("location")}
            error={showError("location")}
            required
            autoComplete="street-address"
            placeholder={t("checkout.locationPlaceholder")}
          />
        </div>
      </CheckoutSection>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? t("checkout.processing") : t("checkout.placeOrder")}
      </button>
    </form>
  );
}
