const Event = require("../models/event.schema.js");

const createEvent = async (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body;

    if (!title || !description || !date || !location || !maxAttendees) {
        return res.status(400).json({ message: "Please provide all required fields" })
    }

    try {
        let imageUrl = "";
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            maxAttendees,
            imageUrl,
            createdBy: req.user._id
        })

        res.status(201).json({ message: "Event created successfully", event })
    } catch (error) {
        res.status(500).json({
            message: "Server error while creating the event",
            error: error.message,
        });
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("createdBy", "username email")
            .populate("attendees", "username");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching events",
            error: error.message,
        });
    }
};

const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id }).populate(
            "attendees",
            "username email"
        );
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching your events",
            error: error.message,
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this event" });
        }

        await event.deleteOne();

        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Server error while deleting the event",
            error: error.message,
        });
    }
}

const updateEvent = async (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body;
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ message: "You are not authorized to edit this event" });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.maxAttendees = maxAttendees || event.maxAttendees;

        if (req.file) {
            event.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedEvent = await event.save();

        res.status(200).json(updatedEvent);

    } catch (error) {
        res.status(500).json({
            message: "Server error while updating the event",
            error: error.message,
        });
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("createdBy", "username email")
            .populate("attendees", "username");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching the event",
            error: error.message,
        });
    }
};

const rsvpEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.attendees.includes(req.user._id)) {
            return res
                .status(400)
                .json({ message: "You have already RSVP'd to this event." });
        }

        if (event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: "This event is fully booked." });
        }

        event.attendees.push(req.user._id);
        await event.save();

        res.status(200).json({ message: "RSVP successful", event });
    } catch (error) {
        res.status(500).json({
            message: "Server error while RSVPing to the event",
            error: error.message,
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getMyEvents,
    deleteEvent,
    updateEvent,
    getEventById,
    rsvpEvent
}