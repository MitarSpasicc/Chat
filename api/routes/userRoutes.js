const router = require("express").Router();
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Get All Users

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  })
);

// Get a User by ID

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);
      res.status(200).json({ name: user.name, id: user._id });
    } catch (error) {
      throw new Error("User does not exist");
    }
  })
);

// Register User
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const userExists = await User.findOne({ name });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, password });

    if (user) {
      res.status(201).json({ name, msg: "User successfully registered" });
    } else {
      throw new Error("Invalid user data");
    }
  })
);

// Login User

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    try {
      const user = await User.findOne({ name });
      if (user && password === user.password) {
        const currentUser = { name, id: user._id };
        res.status(200).json(currentUser);
      }
    } catch (error) {
      res.status(400);
      throw new Error("Wrong password");
    }
  })
);

module.exports = router;
