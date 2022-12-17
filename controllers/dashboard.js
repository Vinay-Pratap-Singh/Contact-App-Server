const Contact=require("../model/user")
exports.dashboard = async (req, res) => {
  const id = req.id;
  let userData;

  try {
    userData = await Contact.findById({ _id: id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to get user",
    });
  }

  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  // removing the password from data
  userData.password = undefined;

  return res.status(200).json({
    success: true,
    data: userData,
  });
};
