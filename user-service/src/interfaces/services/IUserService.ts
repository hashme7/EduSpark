import { CreateUserDto, AuthTokens } from "../../types";

export interface IUserService {
  signup(userData: CreateUserDto): Promise<AuthTokens>;
}
