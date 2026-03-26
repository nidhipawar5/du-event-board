import { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import EventMap from "./components/EventMap";
import ResultsHeader from "./components/ResultsHeader";
import EmptyState from "./components/EmptyState";
import events from "./data/events.json";
import { useUrlState } from "./hooks/useUrlState";
import { useTheme } from "./hooks/useTheme";
import { useEventFilters } from "./hooks/useEventFilters";
import { useMemo } from "react";

export default function App() {
  // URL-synced filter state (unchanged behaviour)
  const [searchTerm, setSearchTerm] = useUrlState("search", "");
  const [selectedRegion, setSelectedRegion] = useUrlState("region", "");
  const [selectedCategory, setSelectedCategory] = useUrlState("category", "");
  const [viewMode, setViewMode] = useUrlState("view", "list");
  const [dateFilterType, setDateFilterType] = useUrlState("dateType", "all");
  const [customDate, setCustomDate] = useUrlState("customDate", "");
  const [rangeStart, setRangeStart] = useUrlState("rangeStart", "");
  const [rangeEnd, setRangeEnd] = useUrlState("rangeEnd", "");

  // Theme (extracted to hook)
  const { theme, toggleTheme } = useTheme();

  // Resets related URL state when date filter type changes
  // (kept in App.jsx because it coordinates multiple URL state setters)
  const handleDateFilterTypeChange = (nextType) => {
    setDateFilterType(nextType);
    if (nextType !== "customDate") setCustomDate("");
    if (nextType !== "customRange") {
      setRangeStart("");
      setRangeEnd("");
    }
  };

  // Derived lists for dropdowns
  const regions = useMemo(
    () => [...new Set(events.map((e) => e.region))].sort(),
    [],
  );
  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category))].sort(),
    [],
  );

  // Filtering logic (extracted to hook)
  const filteredEvents = useEventFilters(events, {
    searchTerm,
    selectedRegion,
    selectedCategory,
    dateFilterType,
    customDate,
    rangeStart,
    rangeEnd,
  });

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        dateFilterType={dateFilterType}
        onDateFilterTypeChange={handleDateFilterTypeChange}
        customDate={customDate}
        onCustomDateChange={setCustomDate}
        rangeStart={rangeStart}
        onRangeStartChange={setRangeStart}
        rangeEnd={rangeEnd}
        onRangeEndChange={setRangeEnd}
        regions={regions}
        categories={categories}
      />
      <main className="main" id="main-content">
        <ResultsHeader
          count={filteredEvents.length}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {viewMode === "list" ? (
          <div className="events-grid" id="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        ) : (
          <EventMap events={filteredEvents} />
        )}
      </main>
      <footer className="footer">
        <p>
          DU Event Board — Built with ❤️ by the community.{" "}
          <a
            href="https://github.com/osl-incubator/du-event-board"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute on GitHub
          </a>
        </p>
      </footer>
    </>
  );
}
