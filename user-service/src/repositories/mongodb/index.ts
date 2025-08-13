import mongoose, { Document, Schema } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { User, CreateUserDto } from "../../types";

interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure email uniqueness
userSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = new UserModel(userData);
    const savedUser = await user.save();

    return {
      id: savedUser._id as string,
      email: savedUser.email,
      password: savedUser.password,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await UserModel.findById(id).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
