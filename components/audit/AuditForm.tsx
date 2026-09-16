"use client";

import { FormEvent, useState } from "react";

const industries = [
  "School / Education",
  "Hotel / Hospitality",
  "Clinic / Healthcare",
  "Church / Religious Organization",
  "Professional Services",
  "Retail",
  "Real Estate",
  "Logistics",
  "Nonprofit",
  "Technology",
  "Media",
  "Other",
];

const companySizes = [
  "1–10",
  "11–25",
  "26–50",
  "51–100",
  "101–250",
  "251–500",
  "500+",
];

const improvementOptions = [
  "Generate more enquiries",
  "Improve customer communication",
  "Automate repetitive work",
  "Improve bookings or appointments",
  "Improve admissions",
  "Improve payments",
  "Connect existing systems",
  "Improve reporting",
  "Introduce AI",
  "Improve website or online presence",
  "Improve internal operations",
  "Improve IT or security",
  "Build a custom system",
  "Other",
];

type FormState = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  improvements: string[];
  manualWork: string;
  existingSystems: string;
  additionalInformation: string;
};

const initialState: FormState = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  companySize: "",
  improvements: [],
  manualWork: "",
  existingSystems: "",
  additionalInformation: "",
};

export default function AuditForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function updateField(
    field: keyof FormState,
    value: string | string[],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleImprovement(value: string) {
    setForm((current) => {
      const exists = current.improvements.includes(value);

      return {
        ...current,
        improvements: exists
          ? current.improvements.filter((item) => item !== value)
          : [...current.improvements, value],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to submit your request.");
      }

      setStatus("success");
      setForm(initialState);
    } catch (submissionError) {
      setStatus("error");

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-[#39358C]/20 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#39358C] text-xl font-bold text-white">
          ✓
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-slate-950">
          Your Technology Audit request has been received.
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
          Thank you for telling us about your business. We'll review your
          information and contact you to arrange the next step.
        </p>

        <p className="mt-6 text-sm font-medium text-slate-800">
          Please check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
    >
      <div className="space-y-10">
        {/* BUSINESS INFORMATION */}
        <section>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              About you and your business
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Tell us who we will be speaking with.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                required
                value={form.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                placeholder="Your full name"
                className={inputClass}
              />
            </Field>

            <Field label="Business / organization name" required>
              <input
                required
                value={form.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
                placeholder="Business name"
                className={inputClass}
              />
            </Field>

            <Field label="Email address" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                placeholder="you@company.com"
                className={inputClass}
              />
            </Field>

            <Field label="Phone / WhatsApp" required>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                placeholder="+234..."
                className={inputClass}
              />
            </Field>

            <Field label="Website">
              <input
                type="url"
                value={form.website}
                onChange={(event) =>
                  updateField("website", event.target.value)
                }
                placeholder="https://..."
                className={inputClass}
              />
            </Field>

            <Field label="Industry" required>
              <select
                required
                value={form.industry}
                onChange={(event) =>
                  updateField("industry", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Select your industry</option>

                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Organization size" required>
              <select
                required
                value={form.companySize}
                onChange={(event) =>
                  updateField("companySize", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Select organization size</option>

                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size} employees / staff
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* GOALS */}
        <section>
          <h3 className="text-xl font-semibold text-slate-950">
            What would you like to improve?
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Select all that apply.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {improvementOptions.map((option) => {
              const checked = form.improvements.includes(option);

              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                    checked
                      ? "border-[#39358C]/40 bg-[#39358C]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleImprovement(option)}
                    className="mt-0.5 h-4 w-4 accent-[#39358C]"
                  />

                  <span className="leading-6 text-slate-700">{option}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* WORKFLOW */}
        <section>
          <h3 className="text-xl font-semibold text-slate-950">
            Tell us about your current processes
          </h3>

          <div className="mt-6 space-y-5">
            <Field
              label="What currently takes too much manual work?"
              required
              hint="For example: entering information, sending reminders, following up with customers, preparing reports, moving data between systems, etc."
            >
              <textarea
                required
                rows={6}
                value={form.manualWork}
                onChange={(event) =>
                  updateField("manualWork", event.target.value)
                }
                placeholder="Tell us about the repetitive work your team handles..."
                className={textareaClass}
              />
            </Field>

            <Field
              label="What software or systems do you currently use?"
              hint="Examples: WhatsApp, Google Workspace, Microsoft 365, CRM, accounting software, school management system, hotel PMS, spreadsheets, etc."
            >
              <textarea
                rows={5}
                value={form.existingSystems}
                onChange={(event) =>
                  updateField("existingSystems", event.target.value)
                }
                placeholder="List the main tools and systems your organization uses..."
                className={textareaClass}
              />
            </Field>

            <Field label="Anything else we should know?">
              <textarea
                rows={5}
                value={form.additionalInformation}
                onChange={(event) =>
                  updateField(
                    "additionalInformation",
                    event.target.value,
                  )
                }
                placeholder="Anything else you'd like us to understand before the audit?"
                className={textareaClass}
              />
            </Field>
          </div>
        </section>

        {/* CONSENT */}
        <section className="rounded-2xl bg-slate-50 p-5">
          <label className="flex gap-3">
            <input
              required
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#39358C]"
            />

            <span className="text-xs leading-5 text-slate-600">
              I confirm that the information provided is accurate and I agree
              that Techtrep may contact me regarding this Technology Audit
              request.
            </span>
          </label>
        </section>

        {status === "error" && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-xl bg-[#39358C] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#2f2b76] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting"
            ? "Submitting your request..."
            : "Request My Free Technology Audit →"}
        </button>

        <p className="text-center text-xs leading-5 text-slate-500">
          Your information will be used to respond to your Technology Audit
          request. We won't sell your information to third parties.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-[#39358C]">*</span>}
      </label>

      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>
      )}

      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39358C] focus:ring-4 focus:ring-[#39358C]/10";

const textareaClass =
  "w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39358C] focus:ring-4 focus:ring-[#39358C]/10";
