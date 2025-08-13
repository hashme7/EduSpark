import mongoose from "mongoose";
import { Logger } from "../../utils/logger";

export class MongoConnection {
  static async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      Logger.info("Connected to MongoDB successfully");
    } catch (error) {
      Logger.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      Logger.info("Disconnected from MongoDB");
    } catch (error) {
      Logger.error("Error disconnecting from MongoDB:", error);
    }
  }
}
