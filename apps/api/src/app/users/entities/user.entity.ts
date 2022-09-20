import {IUserMovieList} from "@movie-picker/api-interfaces";

export class User {
    login: string;
    hash: string;
    salt: string;
    userMovies: IUserMovieList[];
}
