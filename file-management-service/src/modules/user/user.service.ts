import { BadRequestException, forwardRef, Inject, Injectable, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) {}

    async create(createUserDto: CreateUserDto) {
        const {email, username, password} = createUserDto;
        if(!email || !username || !password){
            throw new BadRequestException("Email, username and password are required");
        }
        
        const existingUser = await this.userRepository.createQueryBuilder('user')
            .where('user.email = :email OR user.username = :username', {email, username})
            .getOne();
        
        if(existingUser){
            if(existingUser.email === email){
                throw new PreconditionFailedException("email is already registered");
            }else if(existingUser.username == username){
                throw new PreconditionFailedException("username is already there, try something unique");
            }
        }else{
            if(password?.length < 8){
                throw new BadRequestException("Password is too short");
            }
            if(password?.length > 36){
                throw new BadRequestException("Password is too large");
            }

            const newUser = this.userRepository.create(createUserDto);
            const savedUser = await this.userRepository.save(newUser);
            
            const tokens = await this.authService.generateTokens(savedUser);
            await this.updateTokens(savedUser.id, tokens);
            
            return {
                user: {
                    id: savedUser.id,
                    email: savedUser.email,
                    username: savedUser.username
                },
                ...tokens
            };
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async updateTokens(userId: string, tokens: { accessToken: string; refreshToken: string }) {
        await this.userRepository.update(userId, {
            refreshToken: tokens.refreshToken,
            token: tokens.accessToken
        });
    }

    async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
        const { currentPassword, newPassword } = updatePasswordDto;
        
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        if (newPassword.length < 8) {
            throw new BadRequestException('New password is too short');
        }
        if (newPassword.length > 36) {
            throw new BadRequestException('New password is too large');
        }

        user.password = newPassword;
        return await this.userRepository.save(user);
    }
}
