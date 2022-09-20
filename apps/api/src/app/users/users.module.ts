import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {UserData, UserDataSchema} from '../database/schemas/userData.schema';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
