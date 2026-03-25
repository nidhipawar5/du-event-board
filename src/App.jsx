import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import EventMap from "./components/EventMap";
import events from "./data/events.json";
import { useUrlState } from "./hooks/useUrlState";

import Footer from "./components/Footer";
import SuggestionsPage from "./components/SuggestionsPage";
import ScrollToTop from "./components/ScrollToTop";

function parseISODate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useUrlState("search", "");
  const [selectedRegion, setSelectedRegion] = useUrlState("region", "");
  const [selectedCategory, setSelectedCategory] = useUrlState("category", "");
  const [viewMode, setViewMode] = useUrlState("view", "list");

  const [dateFilterType, setDateFilterType] = useUrlState("dateType", "all");
  const [customDate, setCustomDate] = useUrlState("customDate", "");
  const [rangeStart, setRangeStart] = useUrlState("rangeStart", "");
  const [rangeEnd, setRangeEnd] = useUrlState("rangeEnd", "");

  const [theme, setTheme] = useState(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.getItem === "function"
    ) {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleDateFilterTypeChange = (nextType) => {
    setDateFilterType(nextType);
    if (nextType !== "customDate") setCustomDate("");
    if (nextType !== "customRange") {
      setRangeStart("");
      setRangeEnd("");
    }
  };

  const regions = useMemo(() => {
    return [...new Set(events.map((e) => e.region))].sort();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(events.map((e) => e.category))].sort();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const today = startOfDay(new Date());

    const weekStart = new Date(today);
    const dayIndex = (today.getDay() + 6) % 7;
    weekStart.setDate(today.getDate() - dayIndex);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(0, 0, 0, 0);

    const selectedCustomDate = parseISODate(customDate);
    const selectedRangeStart = parseISODate(rangeStart);
    const selectedRangeEnd = parseISODate(rangeEnd);

    return events.filter((event) => {
      const eventDate = parseISODate(event.date);
      if (!eventDate) return false;

      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        (event.tags &&
          event.tags.some((tag) => tag.toLowerCase().includes(term)));

      const matchesRegion =
        !selectedRegion || event.region === selectedRegion;

      const matchesCategory =
        !selectedCategory || event.category === selectedCategory;

      let matchesDate = true;

      switch (dateFilterType) {
        case "upcoming":
          matchesDate = eventDate >= today;
          break;
        case "thisWeek":
          matchesDate = eventDate >= weekStart && eventDate <= weekEnd;
          break;
        case "thisMonth":
          matchesDate = eventDate >= monthStart && eventDate <= monthEnd;
          break;
        case "customDate":
          matchesDate =
            !selectedCustomDate ||
            eventDate.getTime() === selectedCustomDate.getTime();
          break;
        case "customRange":
          if (
            selectedRangeStart &&
            selectedRangeEnd &&
            selectedRangeStart > selectedRangeEnd
          ) {
            matchesDate = false;
            break;
          }
          if (selectedRangeStart && eventDate < selectedRangeStart)
            matchesDate = false;
          if (selectedRangeEnd && eventDate > selectedRangeEnd)
            matchesDate = false;
          break;
        default:
          matchesDate = true;
      }

      return (
        matchesSearch &&
        matchesRegion &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    searchTerm,
    selectedRegion,
    selectedCategory,
    dateFilterType,
    customDate,
    rangeStart,
    rangeEnd,
  ]);

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

      <main className="main">
        {viewMode === "list" ? (
          <div className="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div>No events found</div>
            )}
          </div>
        ) : (
          <EventMap events={filteredEvents} />
        )}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}