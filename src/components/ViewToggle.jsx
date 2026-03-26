// src/components/ViewToggle.jsx
export default function ViewToggle({ viewMode, onViewChange }) {
  return (
    <div
      className="view-toggle"
      style={{
        display: "flex",
        gap: "0.5rem",
        background: "var(--bg-input)",
        padding: "0.3rem",
        borderRadius: "12px",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <button
        onClick={() => onViewChange("list")}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          background:
            viewMode === "list" ? "var(--accent-primary)" : "transparent",
          color: viewMode === "list" ? "#fff" : "var(--text-muted)",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "bold",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        List
      </button>
      <button
        onClick={() => onViewChange("map")}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          background:
            viewMode === "map" ? "var(--accent-primary)" : "transparent",
          color: viewMode === "map" ? "#fff" : "var(--text-muted)",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "bold",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
        Map
      </button>
    </div>
  );
}
