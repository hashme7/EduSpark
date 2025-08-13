import { UserResponse } from "../../types";

export interface ITokenService {
  generateAccessToken(user: UserResponse): string;
}
