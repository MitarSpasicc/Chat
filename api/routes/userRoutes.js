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
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ name: user.name, id: user._id });
    } else {
      res.status(400);
      throw new Error("User doesn't exist");
    }
  })
);

// Register User
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, password, confirmPassword } = req.body;
    const userExists = await User.findOne({ name });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }
    const user = await User.create({ name, password });
    if (user) {
      res.status(201).json({ name, msg: "successfully registered" });
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

    const user = await User.findOne({ name });
    if (user) {
      if (password === user.password) {
        const currentUser = { name, id: user._id };
        res.status(200).json(currentUser);
      } else {
        res.status(400);
        throw new Error("Wrong password");
      }
    } else {
      res.status(400);
      throw new Error("User doesn't exist");
    }
  })
);

module.exports = router;
