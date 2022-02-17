import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from './todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  public todoStatus: boolean;
  public todoOwner: string;
  public todoBodyText: string;
  public todoCategory: string;
  public viewType: 'card' | 'list' = 'card';


  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
   }


  /**
   * Get the users from the server, filtered by the role and age specified
   * in the GUI.
   */
   getTodosFromServer() {
    this.todoService.getTodos({
      status: this.todoStatus,
      bodyText: this.todoBodyText
    }).subscribe(returnedTodos => {
      // This inner function passed to `subscribe` will be called
      // when the `Observable` returned by `getUsers()` has one
      // or more values to return. `returnedUsers` will be the
      // name for the array of `Users` we got back from the
      // server.
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of todos; the server might be down');
      this.snackBar.open(
        'Problem contacting the server – try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });
  }

  /**
   * Called when the filtering information is changed in the GUI so we can
   * get an updated list of `filteredUsers`.
   */
  public updateFilter() {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { owner: this.todoOwner, category: this.todoCategory }
    );
  }

  ngOnInit(): void {
    this.getTodosFromServer();
  }
}
