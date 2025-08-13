import { App } from "./app";
import { Logger } from "./utils/logger/index";

const bootstrap = async (): Promise<void> => {
  try {
    const app = new App();
    console.log("connecting to to db........");
    // Connect to database
    await app.connectToDatabase();

    // Start server
    app.listen();
  } catch (error) {
    Logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  Logger.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  Logger.error("Uncaught Exception:", err);
  process.exit(1);
});

bootstrap();
