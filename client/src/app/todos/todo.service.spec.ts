import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo-list/todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {
      _id: 'chris_id',
      owner: 'Chris',
      status: true,
      body: 'UMM',
      category: 'admin',
    },
    {
      _id: 'pat_id',
      owner: 'Pat',
      status: false,
      body: 'UMTC',
      category: 'user',
    },
    {
      _id: 'jamie_id',
      owner: 'Jamie',
      status: true,
      body: 'UMD',
      category: 'client',
    }
  ];
  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () => {

    it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
      // Assert that the todos we get from this call to getTodos()
      // should be our set of test todos. Because we're subscribing
      // to the result of getTodos(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testTodos) a few lines
      // down.
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todoUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });

    describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {
      /*
       * We really don't care what `getTodos()` returns in the cases
       * where the filtering is happening on the server. Since all the
       * filtering is happening on the server, `getTodos()` is really
       * just a "pass through" that returns whatever it receives, without
       * any "post processing" or manipulation. So the tests in this
       * `describe` block all confirm that the HTTP request is properly formed
       * and sent out in the world, but don't _really_ care about
       * what `getTodos()` returns as long as it's what the HTTP
       * request returns.
       *
       * So in each of these tests, we'll keep it simple and have
       * the (mocked) HTTP request return the entire list `testTodos`
       * even though in "real life" we would expect the server to
       * return return a filtered subset of the todos.
       */

      it('correctly calls api/todos with filter parameter \'UMM\'', () => {
        todoService.getTodos({ bodyText: 'UMM' }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the body parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('contains')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameter was 'admin'
        expect(req.request.params.get('contains')).toEqual('UMM');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with filter parameter \'status\'', () => {

        todoService.getTodos({ status: true }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameter was 'admin'
        expect(req.request.params.get('status')).toEqual('true');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with multiple filter parameters', () => {

        todoService.getTodos({ status: true, bodyText: 'UMM'}).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl)
            && request.params.has('status') && request.params.has('contains')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameters are correct
        expect(req.request.params.get('status')).toEqual('true');
        expect(req.request.params.get('contains')).toEqual('UMM');

        req.flush(testTodos);
      });
    });
  });

  describe('getTodoByID()', () => {
    it('calls api/todos/id with the correct ID', () => {
      // We're just picking a Todo "at random" from our little
      // set of Todos up at the top.
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
        // Since the `targetTodo`
        // is what the mock `HttpClient` returns in the
        // `req.flush(targetTodo)` line below, this
        // really just confirms that `getTodoById()`
        // doesn't in some way modify the todo it
        // gets back from the server.
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('filterTodos()', () => {
    /*
     * Since `filterTodos` actually filters "locally" (in
     * Angular instead of on the server), we do want to
     * confirm that everything it returns has the desired
     * properties. Since this doesn't make a call to the server,
     * though, we don't have to use the mock HttpClient and
     * all those complications.
     */
    it('filters by owner', () => {
      const todoOwner = 'i';
      const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner });
      // There should be two todos with an 'i' in their
      // name: Chris and Jamie.
      expect(filteredTodos.length).toBe(2);
      // Every returned todo's name should contain an 'i'.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by category', () => {
      const todoCategory = 'admin';
      const filteredTodos = todoService.filterTodos(testTodos, { category: todoCategory });
      // There should be just one todo that has UMM as their company.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's company should contain 'UMM'.
      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by owner and category', () => {
      // There's only one todo (Chris) whose name
      // contains an 'i' and whose company contains
      // an 'M'. There are two whose name contains
      // an 'i' and two whose company contains an
      // an 'M', so this should test combined filtering.
      const todoOwner = 'i';
      const todoCategory = 'a';
      const filters = { owner: todoOwner, category: todoCategory };
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      // There should be just one todo with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo should have _both_ these properties.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
