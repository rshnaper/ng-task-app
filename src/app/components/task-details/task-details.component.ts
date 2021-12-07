import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/models/Task';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskService } from 'src/app/services/task-service.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  @Input() task?: Task;
  
  faTimes = faTimes;

  constructor(private taskService:TaskService) { }

  ngOnInit(): void {
  }

  deleteTask(task:Task) {
    this.taskService.deleteTask(task.id);
  }

  displayTaskCreationDate(task: Task): String {
    let display: String = "";

    if (task.createdDate instanceof Date) {
      const today: Date = new Date();
      const dayDiff = Math.round((today.getTime() - task.createdDate.getTime()) / (3600000 * 24));

      switch (dayDiff) {
        case 0:
          display = "Today";
          break;
        case 1:
          display = "Yesterday";
          break;
        default:
          display = `${dayDiff} days ago`;
          break;
      }
    }
    return display;
  }
}
