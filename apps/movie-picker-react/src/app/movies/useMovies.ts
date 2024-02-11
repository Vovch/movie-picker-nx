import { useContext } from 'react';
import { MoviesContext } from './moviesContext';

export const useMovies = () => useContext(MoviesContext)
