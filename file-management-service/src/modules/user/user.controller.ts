import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      return await this.userService.create(createUserDto);
    }

    @Patch(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body() updatePasswordDto: UpdatePasswordDto
    ) {
        return await this.userService.updatePassword(id, updatePasswordDto);
    }
}
