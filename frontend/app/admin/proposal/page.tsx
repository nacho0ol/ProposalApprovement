"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const InputGroup = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  formData,
  onChange,
}: any) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      name={name}
      value={formData[name] || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#b0413e] bg-white"
    />
  </div>
);

export default function ProposalFormPage() {
  const router = useRouter();
  const [proposalId, setProposalId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    organizer_name: "",
    event_name: "",
    acronym: "",
    delivery_date: "",
    credentials_name: "",
    credentials_title: "",
    credentials_email: "",
    credentials_affiliation: "",
    credentials_address: "",
    credentials_phone: "",
    signatory_name: "",
    signatory_title: "",
    signatory_email: "",
    signatory_affiliation: "",
    signatory_address: "",
    past_editions: "",
    main_organizer: "",
    other_organizers: "",
    sponsors: "",
    conference_type: "In person",
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    conference_website: "",
    past_websites: "",
    past_proceedings_links: "",
    indexes: "",
    audience_undergrad: false,
    audience_grad: false,
    audience_professional: false,
    audience_research: false,
    audience_popular: false,
    editor1_name: "",
    editor1_email: "",
    editor1_affiliation: "",
    editor1_corresponding: "Yes",
    review_type: "Main editor peer review",
    paper_management: "",
    reviewers_per_paper: "",
    expected_submissions: "",
    expected_accepted: "",
    estimated_pages: "",
    estimated_participants: "",
    topics_link: "",
    committee_names: "",
    keynote_speakers: "",
    print_ready: false,
    plagiarism_check: false,
    learn_from: "Internet search",
    agreement_accepted: false,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setProposalId(id);
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (isSubmit: boolean) => {
    if (isSubmit && !formData.agreement_accepted) {
      alert("Please accept the agreement at the bottom before submitting.");
      return;
    }

    const finalOrganizerName =
      formData.organizer_name ||
      formData.credentials_name ||
      "Unknown Organizer";
    const payload = {
      proposal_id: proposalId,
      organizer_name: finalOrganizerName,
      event_name: formData.event_name,
      acronym: formData.acronym,
      delivery_date: formData.delivery_date,
      form_details: formData,
    };

    try {
      const endpoint = isSubmit
        ? "/admin/proposals/submit"
        : "/admin/proposals/draft";
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        router.push("/admin");
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      alert("Gagal menyambung ke server Backend!");
    }
  };

  return (
    <div className="min-h-screen bg-white font-serif text-gray-800">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200 text-sm font-sans">
        <div className="font-bold text-[#b0413e] text-lg tracking-wider">
          ATLANTIS PRESS
        </div>
        <div className="flex gap-10">
          <Link href="/admin" className="text-gray-700 hover:text-black">
            Overview
          </Link>
          <Link href="/admin/proposal" className="text-black font-bold">
            Proceedings proposal
          </Link>
          <button className="text-gray-700 hover:text-black">Logout</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-10 font-sans">
        <Link
          href="/admin"
          className="text-sm text-[#b0413e] hover:underline mb-6 inline-block"
        >
          ← Back to overview
        </Link>
        <h1 className="text-3xl text-[#b0413e] mb-2 font-serif">
          Proceedings proposal
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          * Please note that all form fields are mandatory unless stated
          otherwise.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-[#b0413e] mb-4 border-b border-gray-200 pb-2">
              Your Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="Full Name"
                name="credentials_name"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Title"
                name="credentials_title"
                formData={formData}
                onChange={handleChange}
              />
              <InputGroup
                label="Email address"
                name="credentials_email"
                type="email"
                placeholder="University or professional email required"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Phone number"
                name="credentials_phone"
                formData={formData}
                onChange={handleChange}
              />
              <div className="col-span-1 md:col-span-2">
                <InputGroup
                  label="Affiliation"
                  name="credentials_affiliation"
                  formData={formData}
                  onChange={handleChange}
                  required
                />
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Professional or university address
                </label>
                <textarea
                  name="credentials_address"
                  value={formData.credentials_address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#b0413e] bg-white"
                  rows={3}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#b0413e] mb-4 border-b border-gray-200 pb-2">
              Event details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="Name of the event (in English)"
                name="event_name"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Acronym of the event (in English)"
                name="acronym"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Number of past editions"
                name="past_editions"
                type="number"
                formData={formData}
                onChange={handleChange}
              />
              <InputGroup
                label="Main Organizer"
                name="main_organizer"
                placeholder="University, Institute or Society"
                formData={formData}
                onChange={handleChange}
                required
              />

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Conference type
                </label>
                <select
                  name="conference_type"
                  value={formData.conference_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded bg-white"
                >
                  <option value="In person">In person</option>
                  <option value="Online">Online</option>
                  <option value="In person & Online Hybrid">
                    In person & Online Hybrid
                  </option>
                </select>
              </div>

              <InputGroup
                label="City"
                name="city"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Country"
                name="country"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Start date"
                name="start_date"
                type="date"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="End date"
                name="end_date"
                type="date"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Expected delivery date of articles"
                name="delivery_date"
                type="date"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Conference website"
                name="conference_website"
                type="url"
                formData={formData}
                onChange={handleChange}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#b0413e] mb-4 border-b border-gray-200 pb-2">
              Editors and review
            </h2>
            <h3 className="font-bold mb-2">Editor 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputGroup
                label="Full Name"
                name="editor1_name"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Email address"
                name="editor1_email"
                type="email"
                formData={formData}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Full Affiliation"
                name="editor1_affiliation"
                formData={formData}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Is Corresponding?
                </label>
                <select
                  name="editor1_corresponding"
                  value={formData.editor1_corresponding}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded bg-white"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <label className="block text-sm font-bold text-gray-700 mb-1 mt-6">
              Type of review
            </label>
            <select
              name="review_type"
              value={formData.review_type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-white mb-4"
            >
              <option value="Main editor peer review">
                Main editor peer review
              </option>
              <option value="Open peer review">Open peer review</option>
              <option value="Single-blind peer review">
                Single-blind peer review
              </option>
              <option value="Double-blind peer review">
                Double-blind peer review
              </option>
            </select>

            <InputGroup
              label="Expected number of paper submissions"
              name="expected_submissions"
              type="number"
              formData={formData}
              onChange={handleChange}
            />
            <InputGroup
              label="Estimated minimum number of accepted papers"
              name="expected_accepted"
              type="number"
              formData={formData}
              onChange={handleChange}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#b0413e] mb-4 border-b border-gray-200 pb-2">
              Additional Services
            </h2>

            <label className="flex items-start gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                name="print_ready"
                checked={formData.print_ready}
                onChange={handleChange}
                className="mt-1"
              />
              <span className="text-sm">
                <b>Print version:</b> Yes, I want to receive print-ready files
                (Costs: 1,000 euro).
              </span>
            </label>

            <label className="flex items-start gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                name="plagiarism_check"
                checked={formData.plagiarism_check}
                onChange={handleChange}
                className="mt-1"
              />
              <span className="text-sm">
                <b>Pre-review plagiarism check:</b> Yes, I would like Atlantis
                Press to perform a check.
              </span>
            </label>
          </section>

          <section className="bg-gray-50 p-5 border border-gray-200 rounded">
            <h2 className="text-xl font-bold text-[#b0413e] mb-4 border-b border-gray-300 pb-2">
              Confirmation
            </h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreement_accepted"
                checked={formData.agreement_accepted}
                onChange={handleChange}
                className="mt-1 w-5 h-5 accent-[#b0413e]"
                required
              />
              <span className="text-sm text-gray-700">
                Yes, I accept that the content of these proceedings will be
                distributed under the terms of the Creative Commons Attribution
                License 4.0. Hereby I confirm that all information provided in
                this proposal form is correct and that the volume editors will
                follow the Code of Conduct.
              </span>
            </label>
          </section>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 pb-20">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 font-bold transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-6 py-2 bg-[#b0413e] text-white rounded hover:bg-[#8e3431] font-bold transition-colors shadow"
            >
              Submit proposal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
