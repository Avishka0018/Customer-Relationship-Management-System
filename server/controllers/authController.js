import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN ATTEMPT:", email, password);

    // Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@example.com";
    const ADMIN_PASSWORD = "password123";

    // Check hardcoded credentials directly
    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      // Find admin in DB
      let user = await User.findOne({ email });

      // Create admin if not exists
      if (!user) {
        const hashedPassword = await bcrypt.hash(
          ADMIN_PASSWORD,
          10
        );

        user = await User.create({
          email: ADMIN_EMAIL,
          password: hashedPassword,
        });

        console.log("Admin created");
      }

      // Generate token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        token,
      });
    }

    return res.status(400).json({
      msg: "Invalid email or password",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};