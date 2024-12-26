import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from "react-icons/hi";
import api from "../api/api";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userHasRSVPd, setUserHasRSVPd] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setUserHasRSVPd(response.data.attendees.includes("your_user_id")); // Replace with actual user ID
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Error fetching event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRSVP = async () => {
    try {
      const response = await api.post(`/events/${id}/rsvp`);
      setEvent(response.data.event);
      setUserHasRSVPd(true);
      toast.success("Successfully RSVP'd!");
    } catch (error) {
      console.error("RSVP failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Error RSVPing to the event."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!event) {
    return <p className="text-center text-gray-600">No event details found.</p>;
  }

  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = new Date(event.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Event Image */}
        {event.imageUrl && (
          <img
            src={`http://localhost:5000${event.imageUrl}`}
            alt={event.title}
            className="w-full h-72 object-cover md:h-96 lg:h-108"
          />
        )}

        <div className="p-6 lg:p-8">
          {/* Event Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {event.title}
          </h1>

          {/* Event Details: Date, Time, Location */}
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="text-blue-600 w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineClock className="text-blue-600 w-5 h-5" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker className="text-blue-600 w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* About Event Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            About the Event
          </h2>
          <p className="text-gray-700 mb-6">{event.description}</p>

          {/* RSVP Section */}
          <div className="flex justify-between items-center border-t pt-4">
            {userHasRSVPd ? (
              <p className="text-green-600 font-medium">
                🎉 You have successfully RSVP'd  to this event!
              </p>
            ) : event.attendees.length >= event.maxAttendees ? (
              <p className="text-red-500 font-semibold">
                This event is fully booked.
              </p>
            ) : (
              <button
                onClick={handleRSVP}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                aria-label="RSVP to event"
              >
                RSVP Now
              </button>
            )}

            <p className="text-gray-600 text-sm">
              Seats Available: {event.maxAttendees - event.attendees.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
