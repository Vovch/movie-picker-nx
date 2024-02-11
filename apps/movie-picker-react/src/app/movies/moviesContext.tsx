import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { IGetMoviesApiResponse } from '@movie-picker/api-interfaces';

type TProps = PropsWithChildren

export const MoviesContext = createContext<null | IGetMoviesApiResponse>(null);

export const MoviesProvider: React.FC<TProps> = ({ children }) => {
  const [moviesData, setMoviesData] = useState<null | IGetMoviesApiResponse>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://filmgu.ru/api/movies', { signal })
      .then(res => res.json())
      .then(setMoviesData)
      .catch(error => console.error(`Error fetching movies: ${error}`));
  }, []);

  return (
    <MoviesContext.Provider value={moviesData}>
      {children}
    </MoviesContext.Provider>
  );
};
