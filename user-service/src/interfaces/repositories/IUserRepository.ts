import { User, CreateUserDto } from "../../types";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
}
