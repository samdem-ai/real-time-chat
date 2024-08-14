import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res, next) => {
  try {
    console.log("id")
    const user1 = req.userId;
    const user2 = req.query.id;
    if (!user1 || !user2) {
      res.status(400).send("both user ids are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages  });
  } catch (e) {
    console.log({ e });
    return res.status(500).send("Internal Server Error");
  }
};
