import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HiCalendar, HiUserGroup, HiLocationMarker } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000";

const EventCard = ({
    id,
    title,
    date,
    location,
    imageUrl,
    attendeesCount,
}) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const fullImageUrl = `${BASE_URL}${imageUrl}`;
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const handleViewDetails = () => {
        if (id) {
            navigate(`/event/${id}`);
        } else {
            console.error(
                "Event ID is undefined. Check if the ID is passed correctly."
            );
        }
    };

    return (
        <div 
            className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleViewDetails}
        >
            {/* Event Image */}
            {imageUrl && (
                <img
                    src={fullImageUrl}
                    alt={title}
                    className="w-full h-56 md:h-64 lg:h-72 object-cover rounded-t-lg mb-4"
                />
            )}
            
            <div className="p-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-3 truncate hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h2>

                {/* Event Date */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <HiCalendar className="mr-2 text-gray-500" />
                    <p>{formattedDate}</p>
                </div>

                {/* Event Location */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <HiLocationMarker className="mr-2 text-gray-500" />
                    <p>{location}</p>
                </div>

                {/* Attendees */}
                <div className="flex items-center text-gray-600 text-sm">
                    <HiUserGroup className="mr-2 text-gray-500" />
                    <p>{attendeesCount} going</p>
                </div>
            </div>

            {/* View Details Button */}
            <div className="p-4 bg-gray-100 rounded-b-lg">
                <button
                    onClick={handleViewDetails}
                    className="w-full py-2 px-4 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-center font-semibold hover:bg-gradient-to-l hover:scale-105 transition-all"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default EventCard;
