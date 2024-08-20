import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";

async function server() {
  try {
    await mongoose.connect(config.data_base_url as string);
    console.log("mongoose connected successfully! 🥫");
    app.listen(config.port, () => {
      console.log(`Server running at the port ${config.port} ✨`);
    });
  } catch (error) {
    console.log(error);
  }
}

server().catch((err) => console.log(err));
