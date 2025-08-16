import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schema/user.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    private handleMongoError(error: any, action: string): never {
    if (error.code === 11000) throw new BadRequestException("Email já cadastrado");
    throw new BadRequestException(`Erro ao ${action} usuário: ${error.message}`);
}

    async create(userData: User): Promise<UserDocument> {
        try {
            const newUser = new this.userModel(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            this.handleMongoError(error, "criar");
        }

    }

    async findAll(): Promise<UserDocument[]> {
        try {
            const users = await this.userModel.find().exec();
            return users;
        } catch (error) {
            this.handleMongoError(error, "buscar");
        }
    }

    async findById(id: string): Promise<UserDocument | null> {
        try {
            if (!id) throw new BadRequestException("ID do usuário não fornecido.");

            const user = await this.userModel.findById(id).exec();
            if (!user) throw new BadRequestException("Usuário não encontrado.");

            return user;
        } catch (error) {
            this.handleMongoError(error, "buscar");
        }
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            if (!email) throw new BadRequestException("Email do usuário não fornecido.");
            return await this.userModel.findOne({ email }).exec();
        } catch (error) {
            this.handleMongoError(error, "buscar");
        }
    }

    async findOneAndUpdate(id: string, userData: Partial<User>): Promise<UserDocument | null> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
            if (!updatedUser) {
                throw new BadRequestException("Usuário não encontrado.");
            }
            return updatedUser;
        } catch (error) {
            this.handleMongoError(error, 'atualizar');
        }
    }

    async remove(id: string): Promise<boolean> {
        try {
            const result = await this.userModel.deleteOne({ _id: id }).exec();
            return result.deletedCount > 0;
        } catch (error) {
            this.handleMongoError(error, 'remover');
        }
    }
}
