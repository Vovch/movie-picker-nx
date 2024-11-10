import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieList } from '../database/schemas/movieList.schema';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    async findAll(): Promise<MovieList> {
        return await this.moviesService.findAll();
    }
}
