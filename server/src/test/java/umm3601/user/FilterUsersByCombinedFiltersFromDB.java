package umm3601.user;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

/**
 * Tests umm3601.user.Database listUsers with _age_ and _company_ query
 * parameters
 */
public class FilterUsersByCombinedFiltersFromDB {

  @Test
  public void listUsersWithCombinedFilters() throws IOException {
    UserDatabase db = new UserDatabase("/users.json");
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put("age", Arrays.asList(new String[] {"25"}));
    User[] age25Users = db.listUsers(queryParams);
    assertEquals(2, age25Users.length, "Incorrect number of users with age 25");

    queryParams.clear();
    queryParams.put("company", Arrays.asList(new String[] {"OHMNET"}));
    User[] ohmnetUsers = db.listUsers(queryParams);
    assertEquals(2, ohmnetUsers.length, "Incorrect number of users with company OHMNET");

    queryParams.clear();
    queryParams.put("age", Arrays.asList(new String[] {"25"}));
    queryParams.put("company", Arrays.asList(new String[] {"OHMNET"}));
    User[] ohmnetAge25Users = db.listUsers(queryParams);
    assertEquals(1, ohmnetAge25Users.length, "Incorrect number of users with company OHMNET and age 25");
  }
}
