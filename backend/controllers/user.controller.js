const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.schema");

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const isExist = await User.findOne({ email })

    if (isExist) {
        return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({ username, email, password })

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id, user.username)
        })
    } else {
        res.status(400).json({ message: "Invalid user data" })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id, user.username),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
    });
};

module.exports = { register, login, getUserProfile };