import mongoose from "mongoose";
import Channel from "../models/ChannelsModel.js";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const { userId } = req;

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).send("admin user not found.");
    }

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).send("some members are not valid users");
    }

    const newChannel = new Channel({ name, members, admin: userId });

    await newChannel.save();

    return res.status(201).json({
      channel: newChannel,
    });
  } catch (e) {
    console.log({ e });
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      channels,
    });
  } catch (e) {
    console.log({ e });
    return res.status(500).send(`Internal Server Error: ${e}`);
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const userId = req.userId;
    const channelId = req.query.channelId;

    const channel = await Channel.findById(channelId, "messages");
    if (channel.messages) {
      const messages = await Message.find({
        _id: { $in: channel.messages },
      }).populate("sender");
      console.log(messages);
      if (messages) {
        return res.status(200).json({ messages });
      }
    }
    return res.status(404).send("no message found");
  } catch (e) {
    res.status(500).send(`Internal Server error: ${e}`);
  }
};
