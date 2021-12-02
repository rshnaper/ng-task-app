import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Task } from 'src/app/models/Task';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Output()
  newTaskEvent:EventEmitter<Task> = new EventEmitter<Task>();

  @Input()
  taskName?:string;

  constructor() { }

  ngOnInit(): void {
  }

  addTask(): void {
    if(this.taskName) {
      const task:Task = {"text": this.taskName};
      this.newTaskEvent.emit(task);
      this.taskName="";
    }
  }
}
