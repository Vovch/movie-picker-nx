import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {UserMovie} from './userMovie.schema';

export type UserDataDocument = UserData & Document;

@Schema()
export class UserData {
    @Prop() login: string;
    @Prop() hash: string;
    @Prop() salt: string;
    @Prop() userMovies: UserMovie[];
}

export const UserDataSchema = SchemaFactory.createForClass(UserData);