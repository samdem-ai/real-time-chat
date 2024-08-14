import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) {
      res.status(400).send("Search term is required.");
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^{}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    //TODO:remove the condition to be able to talk to yourself
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (e) {
    console.log({ e });
    return res.status(500).send("Internal Server Error");
  }
};

export const getContactsForDmList = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (e) {
    console.log({ e });
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName email _id"
    );

    const contacts = users.map((user) => ({
      label: user.firstName
        ? `${user.firstName} ${user.lastName}`
        : `${user.email}`,
      value: user._id,
    }));

    return res.status(200).json({ contacts });
  } catch (e) {
    console.log({ e });
    return res.status(500).send("Internal Server Error");
  }
};
