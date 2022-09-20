import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from '../local-auth.guard';
import { GoogleCaptchaGuard } from '../google-captcha.guard';
import {UpdateUserDto} from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(GoogleCaptchaGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);

    return null;
  }

  @Post('getUserMovies')
  @UseGuards(LocalAuthGuard)
  findOne(@Request() req) {
    return req.user.userMovies;
  }

  @Post('changeMovieStatus')
  @UseGuards(LocalAuthGuard)
  changeMovieStatus(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.changeMovieStatus(updateUserDto)
  }
}
