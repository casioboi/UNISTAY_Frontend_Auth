import React, { useEffect, useState } from "react";
import hostels from "../data/hostels";
import HostelCard from "../components/HostelCard";
import CustomDropdown from "../components/CustomDropdown";

const FULL_VIEW_LIMIT = 2;
const PREVIEW_LIMIT = 3;

function getInitialState() {
  try {
    const viewed = JSON.parse(localStorage.getItem("viewedHostels")) || [];
    const previewed = JSON.parse(localStorage.getItem("previewedHostels")) || [];
    const unlocked = localStorage.getItem("hostelAccessUnlocked") === "true";
    return { viewed, previewed, unlocked };
  } catch {
    return { viewed: [], previewed: [], unlocked: false };
  }
}

export default function StudentDashboard() {
  const [state, setState] = useState(getInitialState);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("");
  const [amenities, setAmenities] = useState("");
  const [distance, setDistance] = useState("");

  useEffect(() => {
    localStorage.setItem("viewedHostels", JSON.stringify(state.viewed));
    localStorage.setItem("previewedHostels", JSON.stringify(state.previewed));
    localStorage.setItem("hostelAccessUnlocked", state.unlocked ? "true" : "false");
  }, [state]);

  const handleViewDetails = (id) => {
    if (state.unlocked) return;
    if (state.viewed.includes(id)) return;
    if (state.viewed.length < FULL_VIEW_LIMIT) {
      setState((prev) => ({ ...prev, viewed: [...prev.viewed, id] }));
    } else if (
      !state.previewed.includes(id) &&
      state.previewed.length < PREVIEW_LIMIT
    ) {
      setState((prev) => ({ ...prev, previewed: [...prev.previewed, id] }));
    }
  };

  const handleUnlock = () => {
    alert("Premium unlock placeholder");
    setState((prev) => ({ ...prev, unlocked: true }));
  };

  const getMode = (id, idx) => {
    if (state.unlocked) return "full";
    if (state.viewed.includes(id)) return "full";
    if (state.previewed.includes(id)) return "preview";
    if (state.viewed.length < FULL_VIEW_LIMIT && idx < FULL_VIEW_LIMIT) return "full";
    if (
      state.previewed.length < PREVIEW_LIMIT &&
      idx < FULL_VIEW_LIMIT + PREVIEW_LIMIT
    )
      return "preview";
    return "locked";
  };

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hostel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "hostel" && hostel.name.toLowerCase().includes("hostel"));
    return matchesSearch && matchesFilter;
  });

  const priceOptions = [
    { value: "", label: "Price Range" },
    { value: "500-1000", label: "GHS 500-1000" },
    { value: "1000-1500", label: "GHS 1000-1500" },
    { value: "1500+", label: "GHS 1500+" }
  ];

  const amenitiesOptions = [
    { value: "", label: "Amenities" },
    { value: "wifi", label: "Wi-Fi" },
    { value: "ac", label: "Air Conditioning" },
    { value: "kitchen", label: "Kitchen" },
    { value: "laundry", label: "Laundry" },
    { value: "gym", label: "Gym" }
  ];

  const distanceOptions = [
    { value: "", label: "Distance" },
    { value: "0-1", label: "0-1km" },
    { value: "1-3", label: "1-3km" },
    { value: "3+", label: "3km+" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">UniStay</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search Section */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Find your perfect accommodation</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
              />
              <svg className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          {/* Filter Buttons */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["all", "hostel", "apartment", "room"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedFilter === filter
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <CustomDropdown
              options={priceOptions}
              value={priceRange}
              onChange={setPriceRange}
              placeholder="Price Range"
            />
            <CustomDropdown
              options={amenitiesOptions}
              value={amenities}
              onChange={setAmenities}
              placeholder="Amenities"
            />
            <CustomDropdown
              options={distanceOptions}
              value={distance}
              onChange={setDistance}
              placeholder="Distance"
            />
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Featured Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredHostels.slice(0, 8).map((hostel, idx) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                mode={getMode(hostel.id, idx)}
                onViewDetails={() => handleViewDetails(hostel.id)}
                onUnlock={handleUnlock}
              />
            ))}
          </div>
        </div>

        {/* Unlock CTA */}
        {!state.unlocked && (
          <div className="text-center py-8 sm:py-12">
            <div className="max-w-md mx-auto px-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Unlock Full Access</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get access to all properties and detailed information</p>
              <button
                className="w-full sm:w-auto bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:bg-blue-600 transition-colors"
                onClick={handleUnlock}
              >
                Unlock All Access
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 