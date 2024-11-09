import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieList, MovieListDocument } from '../database/schemas/movieList.schema';
import { Model } from 'mongoose';
import { DEFAULT_LIST_ID } from './movies.constants';
import { readFileSync } from 'fs';
import { join } from 'path';

const movies = JSON.parse(readFileSync(join(__dirname, 'assets/data/movies.json')).toString()).map((movie, index) => ({
    ...movie,
    id: movie.id ?? index,
}));

if (movies.some(({id}) => id === null || id === undefined)) {
  throw new Error('Found movie without ID!')
}

const MovieLists = {
    usNationalRegistry: { listId: DEFAULT_LIST_ID, name: 'usNationalRegistry', list: movies },
};

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(MovieList.name)
        private movieListModel: Model<MovieListDocument>
    ) {}

    async findAll(listId = DEFAULT_LIST_ID): Promise<MovieList> {
        return this.movieListModel
            .findOne(
                { listId },
                {
                    list: {
                        id: 1,
                        name: 1,
                        originalName: 1,
                        director: 1,
                        yearProduced: 1,
                        yearAdded: 1,
                    },
                    listId: 1,
                    name: 1,
                    _id: 0,
                }
            )
            .exec();
    }

    async createMovie(movie: IMovie): Promise<MovieList> {
        const newMovie = new this.movieListModel({
            listId: DEFAULT_LIST_ID,
            list: [movie],
        });
        return newMovie.save();
    }

    async updateMovie(id: number, movie: IMovie): Promise<MovieList> {
        return this.movieListModel.findOneAndUpdate(
            { listId: DEFAULT_LIST_ID, 'list.id': id },
            { $set: { 'list.$': movie } },
            { new: true }
        ).exec();
    }

    async deleteMovie(id: number): Promise<MovieList> {
        return this.movieListModel.findOneAndUpdate(
            { listId: DEFAULT_LIST_ID },
            { $pull: { list: { id } } },
            { new: true }
        ).exec();
    }

    async initDB() {
        await this.movieListModel.collection.deleteMany({});

        await this.movieListModel.create(MovieLists.usNationalRegistry);
    }
}
