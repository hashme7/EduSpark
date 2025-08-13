import { IUserService } from "../../interfaces/services/IUserService";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../interfaces/services/IPasswordService";
import { ITokenService } from "../../interfaces/services/ITokenService";
import { CreateUserDto, AuthTokens, UserResponse } from "../../types";
import { AppError } from "../../utils/error";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async signup(userData: CreateUserDto): Promise<AuthTokens> {
    // Check if user already exists
    console.log("user email", userData.email);
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(userData.password);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Convert to response format
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };

    // Generate token
    const accessToken = this.tokenService.generateAccessToken(userResponse);

    return {
      accessToken,
      user: userResponse,
    };
  }
}
