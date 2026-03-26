// src/components/EmptyState.jsx
export default function EmptyState() {
  return (
    <div className="empty-state" id="empty-state">
      <div className="empty-state__icon">🔎</div>
      <h2 className="empty-state__title">No events found</h2>
      <p className="empty-state__description">
        Try adjusting your search terms or filters to find events near you.
      </p>
    </div>
  );
}
