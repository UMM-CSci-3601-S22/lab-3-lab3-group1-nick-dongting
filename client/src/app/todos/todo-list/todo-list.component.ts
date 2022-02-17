import { Component, OnInit } from '@angular/core';
import { Todo } from './todo';

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


  constructor() { }

  ngOnInit(): void {
  }

}
