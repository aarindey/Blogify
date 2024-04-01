import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.userid;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
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

export async function getMessages(req, res) {
  try {
    const otherUserId = req.params.otherUserId;
    const userId = req.userid;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No converstion between both participants",
      });
    }
    const conversationId = conversation._id;
    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "succesfully retrived messages",
      messages: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed retriving messages",
      error: error,
    });
  }
}

export async function getConversations(req, res) {
  const userId = req.userid;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "username name",
      })
      .populate({ path: "lastMessage.sender", select: "name" });

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    return res.status(200).json({
      message: "convesations successfully retrived",
      conversations: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to retrieve conversations",
      error: error,
    });
  }
}
