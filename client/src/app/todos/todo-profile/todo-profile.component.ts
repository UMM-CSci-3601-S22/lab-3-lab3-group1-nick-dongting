import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '../todo-list/todo';
import { TodoService } from '../todo.service';


@Component({
  selector: 'app-todo-profile',
  templateUrl: './todo-profile.component.html',
  styleUrls: ['./todo-profile.component.scss']
})
export class TodoProfileComponent implements OnInit {

  todo: Todo;
  id: string;

  constructor(private route: ActivatedRoute, private todoService: TodoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      this.todoService.getTodoById(this.id).subscribe(todo => this.todo = todo);
    });
  }

}
