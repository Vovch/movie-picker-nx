import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MovieList,
  MovieListSchema,
} from '../database/schemas/movieList.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MovieList.name, schema: MovieListSchema },
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {
  constructor(movieService: MoviesService) {
    void movieService.initDB();
  }
}
