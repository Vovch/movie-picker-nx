import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieList, MovieListDocument } from '../database/schemas/movieList.schema';
import { Model } from 'mongoose';
import { DEFAULT_LIST_ID } from './movies.constants';
import { readFileSync } from 'fs';
import { join } from 'path';

const movies = JSON.parse(readFileSync(join(__dirname, 'assets/data/movies.json')).toString()).map((movie, index) => ({
    ...movie,
    id: index,
}));

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

    async initDB() {
        await this.movieListModel.collection.deleteMany({});

        await this.movieListModel.create(MovieLists.usNationalRegistry);
    }
}
