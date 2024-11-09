import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieList } from '../database/schemas/movieList.schema';
import { IMovie } from 'libs/api-interfaces/src/lib/api-interfaces';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(): Promise<MovieList> {
    return await this.moviesService.findAll();
  }

  @Post()
  async createMovie(@Body() movie: IMovie): Promise<MovieList> {
    return await this.moviesService.createMovie(movie);
  }

  @Put(':id')
  async updateMovie(@Param('id') id: number, @Body() movie: IMovie): Promise<MovieList> {
    return await this.moviesService.updateMovie(id, movie);
  }

  @Delete(':id')
  async deleteMovie(@Param('id') id: number): Promise<MovieList> {
    return await this.moviesService.deleteMovie(id);
  }
}
