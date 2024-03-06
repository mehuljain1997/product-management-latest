import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const verify_auth = async (req, res, next) => {
  let token = "";
  console.log("verify_auth calling", req.headers);
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const { user_id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("user_id", user_id);
      const user = await userModel.findById(user_id).select("-password");
      console.log("user---", user);
      if(user){
        req.user = user;
        next();
      }
      else {
        res.status(401).send({ status: "failed", message: "Unauthorized user" });
      }

    } catch (error) {
      console.log("Error while verify auth", error);
      res.status(401).send({ status: "failed", message: "Unauthorized user" });
    }
  } else {
    res.status(401).send({ status: "failed", message: "Unauthorized user" });
  }
  // if (!token) {
  //   res
  //     .status(401)
  //     .send({ status: "failed", message: "Unauthorized user, No token" });
  // }
};

export default verify_auth;
