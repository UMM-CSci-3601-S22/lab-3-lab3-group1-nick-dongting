package umm3601.user;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;

import org.junit.jupiter.api.Test;

/**
 * Tests umm3601.user.Database getUser functionality
 */
public class GetUserByIDFromDB {

  @Test
  public void getStokesClayton() throws IOException {
    UserDatabase db = new UserDatabase("/users.json");
    User user = db.getUser("588935f52787254123f71fed");
    assertEquals("Stokes Clayton", user.name, "Incorrect name");
  }

  @Test
  public void getBoltonMonroe() throws IOException {
    UserDatabase db = new UserDatabase("/users.json");
    User user = db.getUser("588935f5556f992bf8f37c01");
    assertEquals("Bolton Monroe", user.name, "Incorrect name");
  }
}
