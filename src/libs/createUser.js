import User from "../models/User.js";

export const createAdminUser = async () => {
  const userFound = await User.findOne({ email: "admin@localhost" });

  if (userFound) return;

  const newUser = new User({
    username: "admin",
    email: "admin@localhost",
    phone: "3202975121"
  });

  newUser.password = await newUser.encryptPassword("adminpassword");

  const admin = await newUser.save();

  console.log("Admin user created", admin);
};
