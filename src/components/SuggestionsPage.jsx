import { useState } from "react";
import { Link } from "react-router-dom";
import "./SuggestionsPage.css";

const FIELDS = [
  {
    id: "description",
    label: "Description",
    hint: "Describe the new feature or improvement you'd like to see. Include details on how it would benefit users.",
    placeholder: "e.g. Add a dark-mode toggle to the event board header…",
    required: true,
    rows: 5,
  },
  {
    id: "useCase",
    label: "Use Case",
    hint: "Explain the context or scenarios in which this feature would be useful.",
    placeholder:
      "e.g. Users browsing events at night would benefit from reduced eye strain…",
    required: true,
    rows: 4,
  },
  {
    id: "implementation",
    label: "Proposed Implementation",
    hint: "Provide a rough idea or steps on how the feature could be implemented.",
    placeholder:
      "e.g. Use prefers-color-scheme media query with a CSS variable switch…",
    required: false,
    rows: 4,
  },
  {
    id: "context",
    label: "Additional Context",
    hint: "Add any other information or screenshots that might help understand your request.",
    placeholder: "e.g. Similar implementations can be found in…",
    required: true,
    rows: 3,
  },
];

const INITIAL = {
  description: "",
  useCase: "",
  implementation: "",
  context: "",
};

function SuggestionsPage() {
  const [form, setForm] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const getError = (field) => {
    if (!field.required || !touched[field.id]) return null;
    return form[field.id].trim() === "" ? `${field.label} is required.` : null;
  };

  const isValid = () =>
    FIELDS.filter((f) => f.required).every((f) => form[f.id].trim() !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields to surface all errors at once
    const allTouched = FIELDS.reduce(
      (acc, f) => ({ ...acc, [f.id]: true }),
      {},
    );
    setTouched(allTouched);

    if (!isValid()) return;

    setStatus("submitting");

    const subject = encodeURIComponent("[DU Event Board] Suggestion");
    const body = encodeURIComponent(
      `Description\n${"-".repeat(60)}\n${form.description}\n\n` +
        `Use Case\n${"-".repeat(60)}\n${form.useCase}\n\n` +
        `Proposed Implementation\n${"-".repeat(60)}\n${
          form.implementation || "N/A"
        }\n\n` +
        `Additional Context\n${"-".repeat(60)}\n${form.context}`,
    );

    window.location.href = `mailto:info@dataumbrella.org?subject=${subject}&body=${body}`;

    // Show success after a short delay to let the mailto open
    setTimeout(() => {
      setStatus("success");
    }, 800);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setTouched({});
    setStatus("idle");
  };

  return (
    <div className="sp-page">
      {/* ── Back link ───────────────────────────── */}
      <div className="sp-topbar">
        <Link to="/" className="sp-back-link" aria-label="Back to event board">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Event Board
        </Link>
      </div>

      <div className="sp-container">
        {/* ── Header ─────────────────────────────── */}
        <header className="sp-header">
          <a
            href="https://www.dataumbrella.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Data Umbrella website"
          >
            <img
              src="https://www.dataumbrella.org/assets/images/logo-light.png"
              alt="Data Umbrella"
              className="sp-logo"
              width="150"
              loading="lazy"
            />
          </a>
          <div className="sp-header-text">
            <h1 className="sp-title">Give Suggestions</h1>
            <p className="sp-subtitle">
              Have an idea or spotted something that could be better? We read
              every message and use your feedback to improve the DU Event Board
              for the whole community.
            </p>
          </div>
        </header>

        {/* ── Success state ───────────────────────── */}
        {status === "success" ? (
          <div className="sp-success" role="alert">
            <div className="sp-success-icon-wrap" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="sp-success-title">Thanks for your suggestion!</h2>
            <div className="sp-success-actions">
              <button onClick={handleReset} className="sp-btn sp-btn--outline">
                Submit another suggestion
              </button>
              <Link to="/" className="sp-btn sp-btn--ghost">
                Back to events
              </Link>
            </div>
          </div>
        ) : (
          /* ── Form ───────────────────────────────── */
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Suggestion form"
            className="sp-form"
          >
            {FIELDS.map((field) => {
              const error = getError(field);
              const hasError = !!error;
              return (
                <div
                  key={field.id}
                  className={`sp-field${hasError ? " sp-field--error" : ""}`}
                >
                  <label htmlFor={`sp-${field.id}`} className="sp-label">
                    {field.label}
                    {!field.required && (
                      <span className="sp-optional"> (Optional)</span>
                    )}
                    {field.required && (
                      <span className="sp-req" aria-hidden="true">
                        {" "}
                        *
                      </span>
                    )}
                  </label>

                  <p className="sp-hint">{field.hint}</p>

                  <textarea
                    id={`sp-${field.id}`}
                    name={field.id}
                    rows={field.rows}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.id]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="sp-textarea"
                    aria-describedby={
                      hasError ? `sp-err-${field.id}` : undefined
                    }
                    aria-invalid={hasError}
                  />

                  {hasError && (
                    <span
                      id={`sp-err-${field.id}`}
                      className="sp-error-msg"
                      role="alert"
                    >
                      {error}
                    </span>
                  )}
                </div>
              );
            })}

            <div className="sp-form-footer">
              <p className="sp-form-note">
                Fields marked <span aria-hidden="true">*</span> are required.
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="sp-btn sp-btn--primary"
              >
                {status === "submitting"
                  ? "Opening email…"
                  : "Submit Suggestion"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SuggestionsPage;
