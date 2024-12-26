import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard"; // Assuming EventCard component exists
import api from "../api/api"; // Your API helper
import { format } from "date-fns";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/all");
        const fetchedEvents = response.data;
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);

        const uniqueLocations = [
          ...new Set(fetchedEvents.map((event) => event.location)),
        ];
        setLocations(uniqueLocations);

        const uniqueCategories = [
          ...new Set(fetchedEvents.map((event) => event.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    handleFilterEvents();
  }, [selectedTitle, selectedCategory, selectedLocation, selectedDate]);

  const handleFilterEvents = () => {
    let filtered = events;

    if (selectedTitle) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(selectedTitle.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (event) => format(new Date(event.date), "yyyy-MM-dd") === selectedDate
      );
    }

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedLocation("");
    setSelectedDate("");
    setSelectedTitle("");
    setFilteredEvents(events);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar Filters */}
      <div className="md:w-1/4 bg-white shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold">Filters</h2>

        <input
          type="text"
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
          placeholder="Search by event title"
          className="w-full p-3 border rounded-lg shadow-md"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-md"
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-md"
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-md"
        />

        <button
          onClick={handleFilterEvents}
          className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="w-full bg-gray-300 text-black p-3 rounded-lg shadow-md hover:bg-gray-400"
        >
          Clear Filters
        </button>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 p-8">
        {/* Hero Section */}
        <div className="relative text-white text-center  mb-12 rounded-xl shadow-xl">
          <img
            src="/bg-color.jpg" // Corrected the image path
            alt="Background illustration for upcoming events" // Added meaningful alt text
            className="h-64 w-full object-cover rounded-xl" // Set height, width, and object-fit
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold">Upcoming Events</h1>
            <p className="mt-4 text-lg">Explore events happening near you!</p>
          </div>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                date={event.date}
                location={event.location}
                imageUrl={event.imageUrl}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-600">
              No events available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
