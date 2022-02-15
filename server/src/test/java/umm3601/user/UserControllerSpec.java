package umm3601.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;
import umm3601.Server;

/**
 * Tests the logic of the UserController
 *
 * @throws IOException
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber" })
public class UserControllerSpec {

  private Context ctx = mock(Context.class);

  private UserController userController;
  private static UserDatabase db;

  @BeforeEach
  public void setUp() throws IOException {
    ctx.clearCookieStore();

    db = new UserDatabase(Server.USER_DATA_FILE);
    userController = new UserController(db);
  }

  @Test
  public void canGetAllUsers() throws IOException {
    // Call the method on the mock controller
    userController.getUsers(ctx);

    // Confirm that `json` was called with all the users.
    ArgumentCaptor<User[]> argument = ArgumentCaptor.forClass(User[].class);
    verify(ctx).json(argument.capture());
    assertEquals(db.size(), argument.getValue().length);
  }

  @Test
  public void canGetUsersWithAge25() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put("age", Arrays.asList(new String[] {"25"}));

    when(ctx.queryParamMap()).thenReturn(queryParams);
    userController.getUsers(ctx);

    // Confirm that all the users passed to `json` have age 25.
    ArgumentCaptor<User[]> argument = ArgumentCaptor.forClass(User[].class);
    verify(ctx).json(argument.capture());
    for (User user : argument.getValue()) {
      assertEquals(25, user.age);
    }
  }

  /**
   * Test that if the user sends a request with an illegal value in
   * the age field (i.e., something that can't be parsed to a number)
   * we get a reasonable error code back.
   */
  @Test
  public void respondsAppropriatelyToIllegalAge() {
    // We'll set the requested "age" to be a string ("abc")
    // that can't be parsed to a number.
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put("age", Arrays.asList(new String[] {"abc"}));

    when(ctx.queryParamMap()).thenReturn(queryParams);
    // This should now throw a `BadRequestResponse` exception because
    // our request has an age that can't be parsed to a number.
    Assertions.assertThrows(BadRequestResponse.class, () -> {
      userController.getUsers(ctx);
    });
  }

  @Test
  public void canGetUsersWithCompany() throws IOException {

    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put("company", Arrays.asList(new String[] {"OHMNET"}));

    when(ctx.queryParamMap()).thenReturn(queryParams);
    userController.getUsers(ctx);

    // Confirm that all the users passed to `json` work for OHMNET.
    ArgumentCaptor<User[]> argument = ArgumentCaptor.forClass(User[].class);
    verify(ctx).json(argument.capture());
    for (User user : argument.getValue()) {
      assertEquals("OHMNET", user.company);
    }
  }

  @Test
  public void canGetUsersWithGivenAgeAndCompany() throws IOException {

    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put("company", Arrays.asList(new String[] {"OHMNET"}));

    queryParams.put("age", Arrays.asList(new String[] {"25"}));

    when(ctx.queryParamMap()).thenReturn(queryParams);
    userController.getUsers(ctx);

    // Confirm that all the users passed to `json` work for OHMNET
    // and have age 25.
    ArgumentCaptor<User[]> argument = ArgumentCaptor.forClass(User[].class);
    verify(ctx).json(argument.capture());
    for (User user : argument.getValue()) {
      assertEquals(25, user.age);
      assertEquals("OHMNET", user.company);
    }
  }

  @Test
  public void canGetUserWithSpecifiedId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("588935f5c668650dc77df581");
    userController.getUser(ctx);
    verify(ctx).status(HttpCode.OK);
  }

  @Test
  public void respondsAppropriatelyToRequestForNonexistentId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("nonexistent");
    Assertions.assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });
  }
}
