import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Task } from 'src/app/models/Task';
import { TaskService } from 'src/app/services/task-service.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  @Input()
  taskName?:string;

  constructor(private taskService:TaskService) { }

  ngOnInit(): void {
  }

  addTask(): void {
    if(this.taskName) {
      const task:Task = {"text": this.taskName};
      this.taskService.addTask(task);
      this.taskName="";
    }
  }
}
