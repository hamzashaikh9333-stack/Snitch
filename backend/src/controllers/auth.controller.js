import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  )

  res.cookie("token", token)
  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      contact: user.contact,
      role: user.role
    }
  })
}

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};


export const login = async (req,res)=>{
  const { email, password } = req.body;

  const user = await userModel.findOne({ email })

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  await sendTokenResponse(user, res, "User logged in successfully");
}