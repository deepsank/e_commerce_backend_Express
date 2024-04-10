import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const dbConnectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${DB_NAME}`
    );
    let dbConnectiondetails=dbConnectionInstance.connection.host;
    console.log(
      "\nSuccessfully connected to the DB instance!!! DB-Details ==> ",dbConnectiondetails
    );
  } catch (error) {
    console.log("Some error occurred while connecting with the DB--- ", error);
    process.exit(1);
  }
};

export default connectDB;
