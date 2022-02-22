import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo, TodoStatus } from '../app/todos/todo-list/todo';
import { TodoService } from 'src/app/todos/todo.service';

@Injectable()
export class MockTodoService extends TodoService {

  static testTodos: Todo[] = [
    {
      _id: '1',
      owner: 'Chris',
      status: true,
      body: 'First Body',
      category: 'groceries',
    },
    {
      _id: '2',
      owner: 'Pat',
      status: false,
      body: 'IBM',
      category: 'editor',
    },
    {
      _id: '3',
      owner: 'Jamie',
      status: true,
      body: 'Frogs, Inc.',
      category: 'video games',
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters?: { status?: boolean; bodyText?: string; sort?: string }): Observable<Todo[]> {
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }
}
