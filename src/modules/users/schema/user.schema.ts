import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/ })
    email: string;

    @Prop({ required: true })
    password: string;
    
}

export type UserDocument = User & Document & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };
export const UserSchema = SchemaFactory.createForClass(User);