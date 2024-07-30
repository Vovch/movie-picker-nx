import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieList, MovieListDocument } from '../database/schemas/movieList.schema';
import { Model } from 'mongoose';
import { DEFAULT_LIST_ID } from './movies.constants';
import { readFileSync } from 'fs';
import { join } from 'path';

const loadList = (listName) =>
  JSON.parse(readFileSync(join(__dirname, `assets/movie-lists/${listName}.json`)).toString());

const MovieLists = {
  usNationalRegistry: {
    listId: DEFAULT_LIST_ID,
    name: 'US National Film Registry',
    list: loadList('us-national-registry'),
  },
  kinopoiskTop250: {
    listId: 'kinopoiskTop250',
    name: 'Kinopoisk Top 250',
    list: loadList('kinopoisk-top-250'),
  },
};

(Object.entries(MovieList) as unknown as Array<{ list: Record<string, string | number>[] }>).forEach(({ list }) => {
  if (list.some(({ id }) => id === null || id === undefined)) {
    throw new Error('Found movie without ID!');
  }
});

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(MovieList.name)
    private movieListModel: Model<MovieListDocument>
  ) {}

  getList(listId = DEFAULT_LIST_ID): Promise<MovieList> {
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

  getListNames(): Promise<{ listId: string; name: string }[]> {
    return this.movieListModel.find({}, { listId: 1, name: 1, _id: 0 }).exec();
  }

  async initDB() {
    await this.movieListModel.collection.deleteMany({});

    await this.movieListModel.create(MovieLists.usNationalRegistry);
    await this.movieListModel.create(MovieLists.kinopoiskTop250);
  }
}
