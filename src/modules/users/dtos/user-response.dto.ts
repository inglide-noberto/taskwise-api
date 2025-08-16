import { UserDocument } from "../schema/user.schema";

export class UserResponseDto {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserDocument) {
        this.id = user._id.toString();
        this.email = user.email;
        this.name = user.name;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
