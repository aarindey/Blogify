import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

async function sendMessage(req, res) {
  try {
    const { receipientId, message } = req.body;
    const senderId = req.userid;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      convesationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: { text: message, sender: senderId },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (error) {}
}

export default sendMessage;
