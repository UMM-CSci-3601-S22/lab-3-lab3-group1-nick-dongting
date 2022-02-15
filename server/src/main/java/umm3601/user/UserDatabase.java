package umm3601.user;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.javalin.http.BadRequestResponse;

/**
 * A fake "userDatabase" of user info
 * <p>
 * Since we don't want to complicate this lab with a real database, we're going
 * to instead just read a bunch of user data from a specified JSON file, and
 * then provide various database-like methods that allow the `UserController` to
 * "query" the "userDatabase".
 */
public class UserDatabase {

  private User[] allUsers;

  public UserDatabase(String userDataFile) throws IOException {
    InputStreamReader reader = new InputStreamReader(getClass().getResourceAsStream(userDataFile));
    ObjectMapper objectMapper = new ObjectMapper();
    allUsers = objectMapper.readValue(reader, User[].class);
  }

  public int size() {
    return allUsers.length;
  }

  /**
   * Get the single user specified by the given ID. Return `null` if there is no
   * user with that ID.
   *
   * @param id the ID of the desired user
   * @return the user with the given ID, or null if there is no user with that ID
   */
  public User getUser(String id) {
    return Arrays.stream(allUsers).filter(x -> x._id.equals(id)).findFirst().orElse(null);
  }

  /**
   * Get an array of all the users satisfying the queries in the params.
   *
   * @param queryParams map of key-value pairs for the query
   * @return an array of all the users matching the given criteria
   */
  public User[] listUsers(Map<String, List<String>> queryParams) {
    User[] filteredUsers = allUsers;

    // Filter age if defined
    if (queryParams.containsKey("age")) {
      String ageParam = queryParams.get("age").get(0);
      try {
        int targetAge = Integer.parseInt(ageParam);
        filteredUsers = filterUsersByAge(filteredUsers, targetAge);
      } catch (NumberFormatException e) {
        throw new BadRequestResponse("Specified age '" + ageParam + "' can't be parsed to an integer");
      }
    }
    // Filter company if defined
    if (queryParams.containsKey("company")) {
      String targetCompany = queryParams.get("company").get(0);
      filteredUsers = filterUsersByCompany(filteredUsers, targetCompany);
    }
    // Filter by role
    if (queryParams.containsKey("role")) {
      String targetRole = queryParams.get("role").get(0);
      filteredUsers = filterUsersByRole(filteredUsers, targetRole);
    }
    // Process other query parameters here...

    return filteredUsers;
  }

  /**
   * Get an array of all the users having the target age.
   *
   * @param users     the list of users to filter by age
   * @param targetAge the target age to look for
   * @return an array of all the users from the given list that have the target
   *         age
   */
  public User[] filterUsersByAge(User[] users, int targetAge) {
    return Arrays.stream(users).filter(x -> x.age == targetAge).toArray(User[]::new);
  }

  /**
   * Get an array of all the users having the target company.
   *
   * @param users         the list of users to filter by company
   * @param targetCompany the target company to look for
   * @return an array of all the users from the given list that have the target
   *         company
   */
  public User[] filterUsersByCompany(User[] users, String targetCompany) {
    return Arrays.stream(users).filter(x -> x.company.equals(targetCompany)).toArray(User[]::new);
  }

  /**
   * Get an array of all the users having the target role.
   *
   * @param users         the list of users to filter by role
   * @param targetRole the target role to look for
   * @return an array of all the users from the given list that have the target
   *         role
   */
  public User[] filterUsersByRole(User[] users, String targetRole) {
    return Arrays.stream(users).filter(x -> x.role.equals(targetRole)).toArray(User[]::new);
  }

}
