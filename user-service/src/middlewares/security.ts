import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { Request, Response, NextFunction } from "express";

// Rate limiting for signup endpoint
export const signupRateLimit = rateLimit({
  windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "900000"), // 15 minutes
  max: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "5"), // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      message: "Too many signup attempts from this IP, please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

export const corsOptions = {
  origin:
    process.env["NODE_ENV"] === "production"
      ? ["https://yourdomain.com"] // Add your production domain
      : ["http://localhost:3000", "http://localhost:3001"], // Development origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
  cors(corsOptions),
  // Custom middleware for selective mongo sanitization
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      console.log(req.body, "reqboy on security");
      if (req.body) {
        console.log(req.body, "req.boy on security");
        req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
      }
      if (req.params) {
        req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
      }
      // Skip query sanitization to avoid the error
      console.log("on next() security Middleware");
      next();
    } catch (error) {
      console.error("Mongo sanitization error:", error);
      next();
    }
  },
  hpp(),
];
