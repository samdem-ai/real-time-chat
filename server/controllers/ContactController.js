import User from "../models/UserModel.js";

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

    res.status(200).send("Logged out successfully.");
  } catch (e) {
    console.log({ e });
    return res.status(500).send("Internal Server Error");
  }
};
