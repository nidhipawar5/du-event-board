// src/hooks/useEventFilters.js
import { useMemo } from "react";
import { parseISODate, startOfDay } from "../utils/date";

export function useEventFilters(
  events,
  {
    searchTerm,
    selectedRegion,
    selectedCategory,
    dateFilterType,
    customDate,
    rangeStart,
    rangeEnd,
  },
) {
  return useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const today = startOfDay(new Date());

    // Week: Monday → Sunday (matches original logic)
    const weekStart = new Date(today);
    const dayIndex = (today.getDay() + 6) % 7; // 0=Mon, 6=Sun
    weekStart.setDate(today.getDate() - dayIndex);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Month: 1st → last day of current month (matches original logic)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(0, 0, 0, 0);

    const selectedCustomDate = parseISODate(customDate);
    const selectedRangeStart = parseISODate(rangeStart);
    const selectedRangeEnd = parseISODate(rangeEnd);

    return events.filter((event) => {
      const eventDate = parseISODate(event.date);
      if (!eventDate) return false;

      // Text search
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        (event.tags &&
          event.tags.some((tag) => tag.toLowerCase().includes(term)));

      // Region
      const matchesRegion = !selectedRegion || event.region === selectedRegion;

      // Category
      const matchesCategory =
        !selectedCategory || event.category === selectedCategory;

      // Date
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

      return matchesSearch && matchesRegion && matchesCategory && matchesDate;
    });
  }, [
    events,
    searchTerm,
    selectedRegion,
    selectedCategory,
    dateFilterType,
    customDate,
    rangeStart,
    rangeEnd,
  ]);
}
