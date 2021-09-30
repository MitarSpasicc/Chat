const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversation", ConversationSchema);

module.exports = Conversation;
