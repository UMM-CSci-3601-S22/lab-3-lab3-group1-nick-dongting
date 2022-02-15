package umm3601;

import java.io.IOException;

import io.javalin.Javalin;
import io.javalin.core.util.RouteOverviewPlugin;
import io.javalin.http.InternalServerErrorResponse;
import umm3601.user.UserDatabase;
import umm3601.user.UserController;
import umm3601.todo.TodoDatabase;
import umm3601.todo.TodoController;

public class Server {

  private static final int PORT_NUMBER = 4567;
  public static final String USER_DATA_FILE = "/users.json";
  public static final String TODO_DATA_FILE = "/todos.json";

  public static void main(String[] args) {

    // Initialize dependencies
    UserController userController = buildUserController();
    TodoController todoController = buildTodoController();

    Javalin server = Javalin.create(
      config -> {
        // This sets things up so that the path "/api" will
        // return an overview of the various paths that this
        // Javalin server supports.
        config.registerPlugin(new RouteOverviewPlugin("/api"));
      }
    ).start(PORT_NUMBER);

    // API endpoints

    // Get specific user
    server.get("/api/users/{id}", userController::getUser);

    // List users, filtered using query parameters
    server.get("/api/users", userController::getUsers);

    // Get specific todo
    server.get("/api/todos/{id}", todoController::getTodo);

    // List todos, filtered using query parameters
    server.get("/api/todos", todoController::getTodos);

    // This catches any uncaught exceptions thrown in the server
    // code and turns them into a 500 response ("Internal Server
    // Error Response"). In general you'll like to *never* actually
    // return this, as it's an instance of the server crashing in
    // some way, and returning a 500 to your user is *super*
    // unhelpful to them. In a production system you'd almost
    // certainly want to use a logging library to log all errors
    // caught here so you'd know about them and could try to address
    // them.
    server.exception(Exception.class, (e, ctx) -> {
      throw new InternalServerErrorResponse(e.toString());
    });
  }

  /**
   * Create a database using the json file, use it as data source for a new
   * UserController
   *
   * Constructing the controller might throw an IOException if there are problems
   * reading from the JSON "database" file. If that happens we'll print out an
   * error message exit the program.
   */
  private static UserController buildUserController() {
    UserController userController = null;

    try {
      UserDatabase userDatabase = new UserDatabase(USER_DATA_FILE);
      userController = new UserController(userDatabase);
    } catch (IOException e) {
      System.err.println("The server failed to load the user data; shutting down.");
      e.printStackTrace(System.err);

      // Exit from the Java program
      System.exit(1);
    }

    return userController;
  }

  /**
   * Create a database using the json file, use it as data source for a new
   * TodoController
   *
   * Constructing the controller might throw an IOException if there are problems
   * reading from the JSON "database" file. If that happens we'll print out an
   * error message exit the program.
   */
  private static TodoController buildTodoController() {
    TodoController todoController = null;

    try {
      TodoDatabase todoDatabase = new TodoDatabase(TODO_DATA_FILE);
      todoController = new TodoController(todoDatabase);
    } catch (IOException e) {
      System.err.println("The server failed to load the todo data; shutting down.");
      e.printStackTrace(System.err);

      // Exit from the Java program
      System.exit(1);
    }

    return todoController;
  }
}
