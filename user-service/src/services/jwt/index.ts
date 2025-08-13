import * as jwt from "jsonwebtoken";
import { ITokenService } from "../../interfaces/services/ITokenService";
import { UserResponse } from "../../types";
import { AppError } from "../../utils/error";

export class TokenService implements ITokenService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: number;

  constructor(jwtSecret: string, jwtExpiresIn: number) {
    if (!jwtSecret) {
      throw new AppError("JWT secret is required", 500);
    }
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
  }

  generateAccessToken(user: UserResponse): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const options: jwt.SignOptions = {
      expiresIn: this.jwtExpiresIn,
      issuer: "Eduspark",
      subject: user.id.toString(),
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }
}
