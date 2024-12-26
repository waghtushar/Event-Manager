import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const EditEvent = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxAttendees: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data;
        setEventData({
          title: event.title,
          description: event.description,
          date: event.date.split("T")[0],
          location: event.location,
          maxAttendees: event.maxAttendees,
          imageUrl: event.image,
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
        setError("Error fetching event details");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("location", eventData.location);
    formData.append("maxAttendees", eventData.maxAttendees);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.put(`/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event updated successfully");
      navigate("/my-events");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Error updating event");
      toast.error("Error updating event");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-8">
      <div className="w-full max-w-xl px-8 py-10 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
          Edit Event
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Event Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event description"
              required
            />
          </div>
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={eventData.maxAttendees}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter max attendees"
                required
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Event Image
            </label>
            {eventData.imageUrl && !image && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img
                  src={eventData.imageUrl}
                  alt="Current Event"
                  className="w-full h-40 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
            {image && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="New Event"
                  className="w-full h-40 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
