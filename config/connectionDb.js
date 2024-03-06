import mongoose from "mongoose";

const connectDB = async (db_url) => {
  try {
    const db_option = {
      dbName: "product_management",
    };
    await mongoose.connect(db_url, db_option);
    console.log("db connected successfully");
  } catch (error) {
    console.error("error while connecting data", error);
  }
};

export default connectDB
