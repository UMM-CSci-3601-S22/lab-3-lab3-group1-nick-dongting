export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }

  getUrl() {
    return cy.url();
  }

  /**
   * Gets the title of the app when visiting the `/todos` page.
   *
   * @returns the value of the element with the ID `.todo-list-title`
   */
  getTodoTitle() {
    return cy.get('.todo-list-title');
  }

  /**
   * Get all the `app-todo-card` DOM elements. This will be
   * empty if we're using the list view of the todos.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `app-todo-card` DOM elements.
   */
  getTodoCards() {
    return cy.get('.todo-cards-container app-todo-card');
  }

  /**
   * Get all the `.todo-list-item` DOM elements. This will
   * be empty if we're using the card view of the todos.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `.todo-list-item` DOM elements.
   */
  getTodoListItems() {
    return cy.get('.todo-nav-list .todo-list-item');
  }

  /**
   * Clicks the "view profile" button for the given todo card.
   * Requires being in the "card" view.
   *
   * @param card The todo card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewProfileButton]').click({force:true});
  }

  /**
   * Change the view of todos.
   *
   * @param viewType Which view type to change to: "card" or "list".
   */
  changeView(viewType: 'card' | 'list') {
    return cy.get(`[data-test=viewTypeRadio] .mat-radio-button[value="${viewType}"]`).click();
  }

  /**
   * Selects a role to filter in the "Status" selector.
   *
   * @param value The role *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectStatus(value: string) {
    return cy.get('[data-test=todoStatusSelect]').click().get(`mat-option[value="${value}"]`).click();
  }

  /**
   * Selects a role to filter in the "SortBy" selector.
   *
   * @param value The role *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectSortBy(value: string) {
    return cy.get('[data-test=todoSortSelect]').click().get(`mat-option[value="${value}"]`).click();
  }
}
