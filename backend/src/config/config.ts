export const JWT_SECRET = "Helloworld";
import mongoose from "mongoose";

/*
 * Establishes a connection to a MongoDB database using Mongoose.
 * - Uses the provided connection string.
 * - Logs success or error messages.
 */
const dbConnect = () => {
  mongoose
    .connect(`${process.env.DBurl}Brainly`)
    .then(() => {
      console.log("Connected Successfully");
    })
    .catch((err) => {
      console.log("Something Wrong", err);
    });
};

export default dbConnect;
