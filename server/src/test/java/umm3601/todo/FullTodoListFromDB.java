package umm3601.todo;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.HashMap;

import org.junit.jupiter.api.Test;

/**
 * Tests umm3601.todo.TodoDatabase listTodo functionality
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber" })
public class FullTodoListFromDB {

  @Test
  public void totalUserCount() throws IOException {
    TodoDatabase db = new TodoDatabase("/todos.json");
    Todo[] allTodos = db.listTodos(new HashMap<>());
    assertEquals(300, allTodos.length, "Incorrect total number of todos");
  }

  @Test
  public void firstUserInFullList() throws IOException {
    TodoDatabase db = new TodoDatabase("/todos.json");
    Todo[] allTodos = db.listTodos(new HashMap<>());
    Todo firstTodo = allTodos[0];
    assertEquals("58895985a22c04e761776d54", firstTodo._id, "Incorrect id");
    assertEquals("Blanche", firstTodo.owner, "Incorrect owner");
    assertEquals(false, firstTodo.status, "Incorrect status");
    assertEquals(
        "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
        firstTodo.body, "Incorrect body");
    assertEquals("software design", firstTodo.category, "Incorrect category");
  }
}
