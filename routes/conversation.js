const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderID, req.body.receiverID],
  });

  try {
      const savedConversation = await newConversation.save();
  } catch (err) {
      res.status(500).json(err)
  }
});

// get conversation

module.exports = router;
