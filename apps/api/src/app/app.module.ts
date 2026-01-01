import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/movies';

@Module({
    imports: [MongooseModule.forRoot(mongoUri), UsersModule, MoviesModule, AuthModule],
})
export class AppModule {}
