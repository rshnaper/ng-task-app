import { Component, Input, OnInit } from '@angular/core';
import { Task } from './models/Task';
import { TaskService } from './services/task-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'ng-task-app';

  tasks:Task[];

  constructor(private taskService:TaskService) {
    this.taskService = taskService;
    this.tasks = [];
  }

  ngOnInit(): void {
    this.taskService.loadTasks().subscribe((data:Task[]) => this.setTasks(data));
  }

  private setTasks(tasks:Task[]) {
    this.tasks = tasks;
  }

  addTask(task:Task) {
    this.taskService.addTask(task)
      .subscribe((newTask) => {
        if(newTask) {
          this.tasks.push(newTask);
        }
      });
  }

  deleteTask(task:Task) {
    this.taskService.deleteTask(task.id).subscribe((deleted) => {
      if(deleted) {
        this.tasks = this.tasks.filter((t) => {return t.id !== task.id});
      }
    });
  }
  
}
