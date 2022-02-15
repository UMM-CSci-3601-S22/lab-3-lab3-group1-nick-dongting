package umm3601.user;

import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about users.
 */
public class UserController {

  private UserDatabase userDatabase;

  /**
   * Construct a controller for users.
   * <p>
   * This loads the "database" of user info from a JSON file and stores that
   * internally so that (subsets of) users can be returned in response to
   * requests.
   *
   * @param userDatabase the `UserDatabase` containing user data
   */
  public UserController(UserDatabase userDatabase) {
    this.userDatabase = userDatabase;
  }

  /**
   * Get the single user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getUser(Context ctx) {
    String id = ctx.pathParam("id");
    User user = userDatabase.getUser(id);
    if (user != null) {
      ctx.json(user);
      ctx.status(HttpCode.OK);
    } else {
      throw new NotFoundResponse("No user with id " + id + " was found.");
    }
  }

  /**
   * Get a JSON response with a list of all the users in the "database".
   *
   * @param ctx a Javalin HTTP context
   */
  public void getUsers(Context ctx) {
    User[] users = userDatabase.listUsers(ctx.queryParamMap());
    ctx.json(users);
  }

}
