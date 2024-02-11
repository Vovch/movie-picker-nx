import { useMovies } from '../useMovies';
import { IMovie } from '@movie-picker/api-interfaces';

export const MoviesTable = () => {
  const moviesData = useMovies();
  const movieKeys = moviesData ? (Object.keys(moviesData.list[0]).sort() as Array<keyof IMovie>) : null;

  return movieKeys ? (
    <table className="border-collapse border border-slate-500 border-r-4 text-slate-100">
      <thead>
        <tr className="bg-slate-700 text-slate-300">
          {movieKeys.map((key) => (
            <th key={key} className="border border-slate-500 p-2">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {moviesData?.list.map((movie) => (
          <tr key={JSON.stringify(movie)} className="bg-slate-800 hover:bg-slate-600">
            {movieKeys.map((key) => (
              <td key={key} className="border border-slate-500 p-2">
                {movie[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : null;
};

export default MoviesTable;
