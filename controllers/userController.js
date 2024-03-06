// import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
  static async register(req, res) {
    try {
      console.log("req", req.body);

      const { email, password, role, confirm_password, name } = req.body;
      if (email && password && role && confirm_password && name) {
        const user = await userModel.findOne({ email: email });
        console.log("user", user);
        if (user) {
          res
            .status(500)
            .json({ status: "failed", message: "user already exist" });
        } else {
          if (password != confirm_password) {
            res.status(500).json({
              status: "failed",
              message: "password and confirm_password not matching",
            });
          } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const doc = new userModel({
              email,
              password: hashPassword,
              role,
              created_date: Date.now(),
              name,
            });
            await doc.save();
            const saved_user = await userModel.findOne({ email: email });
            console.log("saved user", saved_user._id);
            console.log("JWT_SECRET_KEY", process.env.JWT_SECRET_KEY);
            const token = jwt.sign(
              { user_id: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            console.log("token---", token);
            res.status(200).json({
              status: "success",
              message: "Successfully regsiter",
              token: token,
            });
          }
        }
      } else {
        res
          .status(500)
          .json({ status: "failed", message: "All fields required" });
      }
    } catch (error) {
      console.log("error while register user", error.message);
      res
        .status(500)
        .json({ status: "failed", message: "internal Server Error" });
    }
  }

  static async login(req, res) {
    console.log("login calling", req.body);
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await userModel.findOne({ email: email });
        console.log("user", user);
        if (user) {
          const isMatched = await bcrypt.compare(password, user.password);
          console.log("isMatched", isMatched);
          if (isMatched && user.email === email) {
            const token = jwt.sign(
              { user_id: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            console.log("token---", token);
            res.send({
              status: "success",
              message: "Successfully login",
              token: token,
            });
          } else {
            res.status(500).json({
              status: "failed",
              message: "Incorrect email & password",
            });
          }
        } else {
          res.status(500).json({
            status: "failed",
            message: "User not exist, please register first",
          });
        }
      } else {
        res
          .status(500)
          .json({ status: "failed", message: "All fields required" });
      }
    } catch (error) {
      console.log("error while login user", error.message);
      res
        .status(500)
        .json({ status: "failed", message: "internal Server Error" });
    }
  }

  static async changePassword(req, res) {
    try {
      const { password, confirm_password } = req.body;
      if (password != confirm_password) {
        res.status(400).json({
          status: "failed",
          message: "password and confirm_password not matching",
        });
      } else {
        const newHashedPassword = await bcrypt.hash(password, 10);
        console.log("res.user--", req.user);
        await userModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashedPassword },
        });
        res.status(200).json({
          status: "success",
          message: "Successfully change password",
        });
      }
    } catch (error) {
      console.log("error while changePassword", error.message);
      res
        .status(500)
        .json({ status: "failed", message: "internal Server Error" });
    }
  }

  static async loggeduser(req, res) {
    console.log("logged user calling");
    res.status(200).json({ status: "success", user: req.user });
  }

  static async sendPasswordResetEmail(req, res) {
    try {
      const { email } = req.body;
      if (email) {
        const user = await userModel.findOne({ email: email });
        if (!user) {
          return res
            .status(400)
            .send({ status: "failed", message: "email doesn't exist" });
        } else {
          const secret = user._id + process.env.JWT_SECRET_KEY;
          const token = await jwt.sign({ user_id: user._id }, secret, {
            expiresIn: "1d",
          });
          const frontendLink = `http://localhost:3000/api/user/reset/${user._id}/${token}`;
          console.log("frontendLink", frontendLink);
          const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Product Management Password Reset',
            html: `<a href=${frontendLink}>Click Here</a> to reset password`
          })
          res
            .status(201)
            .json({
              status: "success",
              message: "Password Reset Email Sent.... Please check email",
              info: info
            });
        }
      } else {
        res
          .status(400)
          .json({ status: "failed", message: "Bad Request, No Email" });
      }
    } catch (error) {
      console.log("error while sendPasswordResetEmail", error.message);
      res
        .status(500)
        .json({ status: "failed", message: "internal Server Error" });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { password, confirm_password } = req.body;
      const { id, token } = req.params;

      const user = await userModel.findById(id);
      console.log("user", user);
      const new_secret = user._id + process.env.JWT_SECRET_KEY;
      await jwt.verify(token, new_secret);
      if (password && confirm_password) {
        if (password !== confirm_password) {
          res
            .status(400)
            .json({
              status: "failed",
              message: "password and confirm_password not matching",
            });
        } else {
          const newHashedPassword = await bcrypt.hash(password, 10);
          await userModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashedPassword },
          });
          res.status(200).json({
            status: "success",
            message: "Password Reset Successfully",
          });
        }
      } else {
        res
          .status(400)
          .json({ status: "failed", message: "All Fields Required" });
      }
    } catch (error) {
      console.log("error while resetPassword", error.message);
      res.status(500).json({ status: "failed", message: "Invalid Token" });
    }
  }
}

export default UserController;
