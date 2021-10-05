const router = require("express").Router();
const Conversation = require("../models/Conversation");
const asyncHandler = require("express-async-handler");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.body;

    const conversation = await Conversation.find({});

    const filtered = conversation.filter(
      (c) =>
        c.members.indexOf(senderId) !== -1 &&
        c.members.indexOf(receiverId) !== -1
    );

    if (filtered.length > 0) {
      res.status(400);
      throw new Error("Conversation already exists");
    }

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const response = await newConversation.save();
    res.status(201).json(response);
  })
);

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate("members");

    if (conversation) {
      res.status(200).json(conversation);
    } else {
      throw new Error("Conversation doesn't exist");
    }
  })
);

router.delete(
  "/:userId",
  asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOneAndDelete({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(conversation);
  })
);

module.exports = router;
