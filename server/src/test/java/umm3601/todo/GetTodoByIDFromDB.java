package umm3601.todo;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;

import org.junit.jupiter.api.Test;

/**
 * Tests umm3601.todo.TodoDatabase getTodo functionality
 */
public class GetTodoByIDFromDB {

  @Test
  public void getFryHomework() throws IOException {
    TodoDatabase db = new TodoDatabase("/todos.json");
    Todo todo = db.getTodo("58895985e96bc855be665b7d");
    assertEquals("Fry", todo.owner, "Incorrect owner");
    assertEquals("homework", todo.category, "Incorrect category");
  }

  @Test
  public void getRobertaSoftwareDesign() throws IOException {
    TodoDatabase db = new TodoDatabase("/todos.json");
    Todo todo = db.getTodo("588959858d6f5457cb2b779f");
    assertEquals("Roberta", todo.owner, "Incorrect owner");
    assertEquals("software design", todo.category, "Incorrect category");
  }
}
