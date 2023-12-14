import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'), UsersModule, MoviesModule, AuthModule],
})
export class AppModule {}
