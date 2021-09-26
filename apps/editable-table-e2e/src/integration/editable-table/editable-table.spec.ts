describe('editable-table: EditableTable component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=editabletable--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to EditableTable!');
    });
});
