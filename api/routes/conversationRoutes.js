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

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });

      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

router.delete(
  "/:userId",
  asyncHandler(async (req, res) => {
    try {
      await Conversation.findOneAndDelete({
        members: { $in: [req.params.userId] },
      });

      res.status(200).json("Successfully Deleted!");
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

module.exports = router;
