// src/components/ResultsHeader.jsx
import ViewToggle from "./ViewToggle";

export default function ResultsHeader({ count, viewMode, onViewChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        paddingLeft: "0.25rem",
      }}
    >
      <p
        className="main__results-info"
        style={{ marginBottom: 0, paddingLeft: 0 }}
      >
        Showing <span className="main__results-count">{count}</span> event
        {count !== 1 ? "s" : ""}
      </p>
      <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />
    </div>
  );
}
