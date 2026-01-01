import { IMovie } from '@movie-picker/api-interfaces';
import {
  getColumnHeader,
  getFirstColumnCells,
  getModal,
  getMovieRows,
  getSearchInput,
} from '../support/app.po';
import { orderBy } from 'lodash';

describe('movie-picker', () => {
  before(() => {
    cy.request('/api/movies')
      .its('body.list')
      .as('movieData');
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the movie list returned by the API', () => {
    cy.get('@movieData').then((movies: IMovie[]) => {
      getMovieRows().should('have.length', movies.length);
      cy.contains('Total:').should('contain', movies.length);
      cy.contains('td', movies[0].name).should('be.visible');
      cy.contains('td', movies[1].originalName).should('be.visible');
    });
  });

  it('filters movies as the user types in the search box', () => {
    const searchTerm = 'angry';

    cy.get('@movieData').then((movies: IMovie[]) => {
      const expectedMatches = movies.filter((movie) =>
        Object.values(movie).some((value) => String(value).toLowerCase().includes(searchTerm))
      );

      getSearchInput().type(searchTerm);
      getMovieRows().should('have.length', expectedMatches.length);
      cy.contains('td', expectedMatches[0].originalName).should('be.visible');

      getSearchInput().clear().type('zzzz');
      cy.contains('td', 'No movies found.').should('be.visible');
      cy.contains('Total: 0 movies.').should('be.visible');
    });
  });

  it('sorts movies when a column header is clicked', () => {
    const yearAddedColumn = getColumnHeader('Year Added to Registry');

    const assertMovieOrder = (expectedOrder: string[]) => {
      getFirstColumnCells()
        .should('have.length.at.least', expectedOrder.length)
        .then(($cells) => {
          const names = [...$cells]
            .slice(0, expectedOrder.length)
            .map((cell) => cell.textContent?.trim());

          expect(names).to.deep.eq(expectedOrder);
        });
    };

    cy.get('@movieData').then((movies: IMovie[]) => {
      const sortedAsc = orderBy(movies, ['yearAdded'], ['asc']);
      const sortedDesc = orderBy(movies, ['yearAdded'], ['desc']);

      yearAddedColumn.click();
      assertMovieOrder(sortedAsc.slice(0, 3).map((movie) => movie.name));

      yearAddedColumn.click();
      assertMovieOrder(sortedDesc.slice(0, 3).map((movie) => movie.name));
    });
  });

  it('shows the selected movie in a modal', () => {
    cy.get('@movieData').then((movies: IMovie[]) => {
      const targetMovie = movies.find((movie) => movie.originalName === '12 Angry Men') ?? movies[0];

      cy.contains('td', targetMovie.name).click();

      getModal().within(() => {
        cy.contains('.header', targetMovie.name).should('be.visible');
        cy.contains('.label', 'Original Name').siblings('.value').should('contain', targetMovie.originalName);
        cy.contains('.label', 'Director').siblings('.value').should('contain', targetMovie.director);
        cy.contains('.label', 'Duration')
          .siblings('.value')
          .should('contain', targetMovie.durationMinutes ?? 'Unknown');
      });

      cy.get('.modal .close').click();
      getModal().should('not.exist');
    });
  });

  it('opens a random movie via the dice button', () => {
    cy.get('@movieData').then((movies: any[]) => {
      cy.window().then((win) => cy.stub(win.Math, 'random').returns(0.2));
      cy.get('.random-button-wrapper').click();

      const expectedMovie = movies[Math.floor(0.2 * movies.length)];

      getModal().within(() => {
        cy.contains('.header', expectedMovie.name).should('be.visible');
        cy.contains('.label', 'Year Added').siblings('.value').should('contain', expectedMovie.yearAdded);
      });
    });
  });
});
