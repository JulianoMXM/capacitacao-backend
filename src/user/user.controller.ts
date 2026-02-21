import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import type { RequestWithUser } from 'src/auth/types/request-with-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getInfo(@Request() req: RequestWithUser) {
    return this.userService.getInfo(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateInfo(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto
  ) {
    
    if(Object.keys(updateUserDto).length === 0){
      throw new BadRequestException('Nenhum dado para atualizar.')
    }
    return this.userService.updateInfo(updateUserDto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(
    @Request() req: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {

    if(Object.keys(updatePasswordDto).length === 0){
      throw new BadRequestException('Nenhum dado para atualizar.')
    }
    return this.userService.updatePassword(updatePasswordDto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  delete(@Request() req: RequestWithUser) {
    return this.userService.deleteAccount(req.user.id);
  }
}
