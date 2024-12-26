import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api/api";
import { BeatLoader } from "react-spinners"; // For loading spinner

const BASE_URL = "http://localhost:5000";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/events/my-events");
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setError("Error fetching events");
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      if (window.confirm("Are you sure you want to delete this event?")) {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));
        toast.success("Event deleted successfully");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to delete event");
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BeatLoader size={15} color="#093054" loading={loading} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        My Events
      </h2>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          You have not created any events yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event, index) => (
                <tr
                  key={event._id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.imageUrl && (
                      <img
                        src={`${BASE_URL}${event.imageUrl}`}
                        alt={event.title}
                        className="h-20 w-20 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {event.attendees.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {event.attendees.map((attendee) => (
                            <li key={attendee._id}>{attendee.username}</li>
                          ))}
                        </ul>
                      ) : (
                        "No attendees yet"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(event._id)}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="flex items-center text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt className="mr-2" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
