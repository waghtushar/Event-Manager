const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { createEvent, getAllEvents, getMyEvents, deleteEvent, updateEvent, getEventById, rsvpEvent } = require("../controllers/event.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const eventRoutes = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
});

eventRoutes.post("/create", protect, upload.single("image"), createEvent);
eventRoutes.get("/all", getAllEvents);
eventRoutes.get("/my-events", protect, getMyEvents);
eventRoutes.delete("/:id", protect, deleteEvent);
eventRoutes.put("/:id", protect, upload.single("image"), updateEvent);
eventRoutes.get("/:id", getEventById);
eventRoutes.post("/:id/rsvp", protect, rsvpEvent);

module.exports = eventRoutes;