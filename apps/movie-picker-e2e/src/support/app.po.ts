export const getMovieRows = () => cy.get('tbody .list__row');
export const getSearchInput = () => cy.get('#search');
export const getColumnHeader = (label: string) => cy.contains('th', label);
export const getModal = () => cy.get('.modal');
export const getFirstDataColumnCells = () => cy.get('tbody .list__row td:nth-child(2)');
