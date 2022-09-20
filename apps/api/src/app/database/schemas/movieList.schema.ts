import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {Movie} from './movie.schema';

export type MovieListDocument = MovieList & Document;

@Schema()
export class MovieList {
    @Prop() listId: string;
    @Prop() name: string;
    @Prop() list: Movie[];
}

export const MovieListSchema = SchemaFactory.createForClass(MovieList);