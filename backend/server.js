const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/user.route.js");
const eventRoutes = require("./routes/event.route.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
    db();
    if(err){
        console.log(err,"Server is not connected")
    }
    console.log(`Server is running on http://localhost:${PORT}`)
})