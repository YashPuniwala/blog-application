const { default: mongoose } = require("mongoose");

const connection = {};

export const connectToDb = async () => {
  try {
    if (connection?.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO);
    connection.isConnected = db.connection.readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};