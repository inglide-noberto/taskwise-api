import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schema/user.schema";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(userData: CreateUserDto): Promise<UserDocument> {
        // TODO: implementar hash pra salvar a senha
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    // TODO: testar os outros métodos do mongoose

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findOneAndUpdate(id: string, userData: Partial<CreateUserDto>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    }
}
