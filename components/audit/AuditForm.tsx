"use client";

import { FormEvent, useState } from "react";

const improvementOptions = [
  "Customer enquiries",
  "Communication",
  "Internal workflows",
  "Existing systems",
  "Data & reporting",
  "Automation & AI",
];

export default function AuditForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Capture the form before the async operation.
    // event.currentTarget may be null after an await.
    const form = event.currentTarget;

    setIsSubmitting(true);
    setMessage("");
    setSuccess(false);

    const formData = new FormData(form);

    const improvements = formData.getAll("improvements");

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      businessName: String(formData.get("businessName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      website: String(formData.get("website") || ""),
      industry: String(formData.get("industry") || ""),
      companySize: String(formData.get("companySize") || ""),
      improvements,
      manualWork: String(formData.get("manualWork") || ""),
      existingSystems: String(formData.get("existingSystems") || ""),
      additionalInformation: String(
        formData.get("additionalInformation") || ""
      ),
      consent: formData.get("consent") === "on",
    };

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your audit request."
        );
      }

      setSuccess(true);
      setMessage(
        data.message || "Your technology audit request has been received."
      );

      // Reset only after a successful submission.
      form.reset();
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-slate-900"
          >
            Full name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          />
        </div>

        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-semibold text-slate-900"
          >
            Business name *
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-900"
          >
            Business email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-slate-900"
          >
            Phone / WhatsApp *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="block text-sm font-semibold text-slate-900"
          >
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          />
        </div>

        <div>
          <label
            htmlFor="industry"
            className="block text-sm font-semibold text-slate-900"
          >
            Industry *
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            required
            placeholder="e.g. School, Hotel, Healthcare"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="companySize"
            className="block text-sm font-semibold text-slate-900"
          >
            Company size *
          </label>
          <select
            id="companySize"
            name="companySize"
            required
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
          >
            <option value="" disabled>
              Select company size
            </option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201-500">201–500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">
          Where would you most like to improve?
        </legend>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {improvementOptions.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 transition hover:border-[#39358C]/40"
            >
              <input
                type="checkbox"
                name="improvements"
                value={option}
                className="h-4 w-4 rounded border-slate-300"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="manualWork"
          className="block text-sm font-semibold text-slate-900"
        >
          What does your team currently do manually? *
        </label>
        <textarea
          id="manualWork"
          name="manualWork"
          required
          rows={5}
          placeholder="Tell us about repetitive tasks, spreadsheets, follow-ups, data entry or other manual work."
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
        />
      </div>

      <div>
        <label
          htmlFor="existingSystems"
          className="block text-sm font-semibold text-slate-900"
        >
          What software or systems do you currently use?
        </label>
        <textarea
          id="existingSystems"
          name="existingSystems"
          rows={4}
          placeholder="For example: accounting software, CRM, HR system, WhatsApp, website, spreadsheets, POS, etc."
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
        />
      </div>

      <div>
        <label
          htmlFor="additionalInformation"
          className="block text-sm font-semibold text-slate-900"
        >
          Anything else we should know?
        </label>
        <textarea
          id="additionalInformation"
          name="additionalInformation"
          rows={4}
          placeholder="Share any technology challenges, goals or context that may help us prepare."
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#39358C] focus:ring-2 focus:ring-[#39358C]/10"
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />
        <span>
          I agree that Techtrep may contact me regarding this Technology
          Audit and the information I have submitted.
        </span>
      </label>

      {message && (
        <div
          className={`rounded-xl p-4 text-sm ${
            success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#39358C] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#2f2b76] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Request My Free Audit →"}
      </button>
    </form>
  );
}