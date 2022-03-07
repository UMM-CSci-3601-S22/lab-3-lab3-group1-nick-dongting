import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });


  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for todo 'Fry'
    cy.get('#todo-owner-input').type('Fry');

    // All of the todo cards should have the owner's name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Fry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each(el =>
      expect(el.text()).to.equal('Fry')
    );
  });

  it('Should type something in the body filter and check that it returned correct elements', () => {
    cy.get('#todo-body-text-input').type('Ipsum esse est ullamco magna');

    page.getTodoCards().should('have.lengthOf.above', 0);

    // All of the todo cards should have the body we are filtering by
    page.getTodoCards().each(card => {
      cy.wrap(card).find('.todo-card-owner').should('have.text', 'Fry');
    });

    page.clickViewProfile(page.getTodoCards().first());

    // All of the todo cards should have the body we are filtering by
    cy.get('.todo-card-body').first().should('contain.text', 'Ipsum esse est ullamco magna');
  });

  it('Should type something partial in the body filter and check that it returned correct elements', () => {
    // Filter for body that contain 'esse est dolore'
    cy.get('#todo-body-text-input').type('esse est dolore');

    page.getTodoCards().should('have.lengthOf.above', 0);

    page.getTodoCards().each(card => {
      cy.wrap(card).find('.todo-card-owner').should('have.text', 'Blanche');
    });

    page.clickViewProfile(page.getTodoCards().first());

    // Go through each of the cards that are being shown and get the companies
    cy.get('.todo-card-body').first()
      // We should see these body keywords
      .should('contain.text', 'non nulla')
      .should('contain.text', 'aliquip')
      // We shouldn't see these body keywords
      .should('not.contain.text', 'NOTEXIST')
      .should('not.contain.text', 'IMPOSSIBLETOHAVETHIS');
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    cy.get('#todo-category-input').type('software design');

    page.getTodoCards().should('have.lengthOf.above', 0);

    page.clickViewProfile(page.getTodoCards().first());

    // All of the todo cards should have the category we are filtering by
    cy.get('.todo-card-category').first().should('have.text', 'software design');
  });

  it('Should type something partial in the category filter and check that it returned correct elements', () => {
    // Filter for categories that contain 'games'
    cy.get('#todo-category-input').type('games');

    page.getTodoCards().should('have.lengthOf.above', 0);

    page.clickViewProfile(page.getTodoCards().first());

    // Go through each of the cards that are being shown and get the categories
    cy.get('.todo-card-category').first()
      // We should see these keywords
      .should('contain.text', 'video')
      .should('contain.text', 'games')
      // We shouldn't see these keywords
      .should('not.contain.text', 'homework')
      .should('not.contain.text', 'software');
  });


  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });

  it('Should select a status, switch the view, and check that it returned correct elements', () => {
    // Filter for status 'complete');
    page.selectStatus('complete');

    // Choose the view type "List"
    page.changeView('list');

    // Some of the todos should be listed
    page.getTodoListItems().should('have.lengthOf.above', 0);

    // All of the todo list items that show should have the status we are looking for
    page.getTodoListItems().each(el => {
      cy.wrap(el).find('.todo-list-status').should('contain.text', 'true');
    });
  });

  it('Should click view profile on a todo and go to the right URL', () => {
    page.getTodoCards().first().then((card) => {
      const firstTodoOwner = card.find('.todo-card-owner').text();
      const firstTodoStatus = card.find('.todo-card-status').text();

      // When the view profile button on the first todo card is clicked, the URL should have a valid mongo ID
      page.clickViewProfile(page.getTodoCards().first());

      // The URL should be '/todos/' followed by a mongo ID
      cy.url().should('match', /\/todos\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the owner and category should be correct
      cy.get('.todo-card-owner').first().should('have.text', firstTodoOwner);
      cy.get('.todo-card-status').first().should('have.text', firstTodoStatus);
    });
  });
});
