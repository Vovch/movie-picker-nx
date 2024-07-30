import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieList } from '../database/schemas/movieList.schema';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getDefaultList(): Promise<MovieList> {
    return await this.moviesService.getList();
  }

  @Get('lists')
  async getListNames(): Promise<{ name: string; listId: string }[]> {
    return await this.moviesService.getListNames();
  }

  @Get(':id')
  async getList(@Param() params: { id: string }): Promise<MovieList> {
    return await this.moviesService.getList(params.id);
  }
}
