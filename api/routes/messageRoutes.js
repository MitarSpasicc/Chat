const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    if (savedMessage) {
      res.status(200).json(savedMessage);
    } else {
      throw new Error("Message didn't send");
    }
  })
);

router.get(
  "/:conversationId",
  asyncHandler(async (req, res) => {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  })
);

module.exports = router;
