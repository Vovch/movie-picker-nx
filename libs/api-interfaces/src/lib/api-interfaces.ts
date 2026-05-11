export interface ICreateUserRequest {
    login: string;
    hash: string;
}

export interface IMovie {
    id: number;
    name: string;
    originalName: string;
    director: string;
    yearProduced: string;
    yearAdded: string;
    durationMinutes: number | null;
    /**
     * Free access to the full work in a normal browser (no paid rental, subscription, or
     * account-only storefront). Prefer Library of Congress National Screening Room direct
     * `video/mp4` URLs from `https://www.loc.gov/item/{id}/?fo=json`, then Internet Archive
     * `https://archive.org/details/{identifier}` or other clearly free hosts. Use `null` when
     * no suitable free option exists. Use a string array when the work is split across several
     * URLs (for example multiple YouTube parts of the same title).
     */
    watchUrl: string | string[] | null;
}

export interface IGetMoviesApiResponse {
    listId: string;
    name: string;
    list: IMovie[];
}

export interface IUserMovieList {
    listId: string;
    movieId: number;
    status: string | null;
}

export type TGetUserMoviesModelResponse = IUserMovieList[];

export interface ILoginRequest {
    login: string;
    hash: string;
    captchaResponse: string;
}

export enum EMovieStatus {
    WATCHED = 'WATCHED',
    POSTPONED = 'POSTPONED',
}
