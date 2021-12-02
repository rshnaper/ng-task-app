import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/Task';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {


  @Input()
  tasks?: Task[];

  @Output()
  onDeleteTask = new EventEmitter<Task>();

  constructor() {
  }

  ngOnInit(): void {
    
  }

  deleteTask(task:Task) {
    this.onDeleteTask.emit(task);
  }

}
