import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return new UserResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? new UserResponseDto(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto | null> {
    const updatedUser = await this.userRepository.findOneAndUpdate(id, updateUserDto);
    return updatedUser ? new UserResponseDto(updatedUser) : null;
  }

  async remove(id: string): Promise<boolean> {
    return await this.userRepository.remove(id);
  }
}
