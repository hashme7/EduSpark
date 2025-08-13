import express from "express";
import { config } from "./config/index";
import { MongoConnection } from "./database/mongodb/connection";
import { MongoUserRepository } from "./repositories/mongodb/index";
import { UserService } from "./services/user/index";
import { PasswordService } from "./services/passwords/index";
import { TokenService } from "./services/jwt/index";
import { UserController } from "./controllers/index";
import { createUserRoutes } from "./routes/routes";
import { errorHandler } from "./middlewares/errorHandler";
import { securityMiddleware, generalRateLimit } from "./middlewares/security";
import { Logger } from "./utils/logger";

export class App {
  public app: express.Application;
  private userController!: UserController;

  constructor() {
    this.app = express();
    this.initializeSecurityMiddleware();
    this.initializeBodyParsers();
    this.initializeDependencies();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeSecurityMiddleware(): void {
    this.app.use(generalRateLimit);
    this.app.use(securityMiddleware);
  }

  private initializeBodyParsers(): void {
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  private initializeDependencies(): void {
    // Initialize repositories
    const userRepository = new MongoUserRepository();

    // Initialize services
    const passwordService = new PasswordService(config.bcryptRounds);
    const tokenService = new TokenService(
      config.jwtSecret,
      config.jwtExpiresIn
    );
    const userService = new UserService(
      userRepository,
      passwordService,
      tokenService
    );

    // Initialize controllers
    this.userController = new UserController(userService);
  }

  private initializeRoutes(): void {
    console.log("🔧 Setting up health route...");
    // Health check
    this.app.get("/health", (_req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
      });
    });
    console.log("✅ Health route setup complete");

    console.log("🔧 Setting up auth routes...");
    // API routes
    this.app.use("/api/auth", createUserRoutes(this.userController));
    console.log("✅ Auth routes setup complete");

    console.log("🔧 Setting up 404 handler...");
    // Handle 404
    // this.app.all("*", (req, res) => {
    //   res.status(404).json({
    //     success: false,
    //     error: {
    //       message: `Route ${req.originalUrl} not found`,
    //     },
    //   });
    // });
    // console.log("✅ 404 handler setup complete");
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async connectToDatabase(): Promise<void> {
    await MongoConnection.connect(config.mongoUri);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      Logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  }
}
