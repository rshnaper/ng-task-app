import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/Task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = "http://localhost:4000";
  private readonly dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  private tasksSubject:Subject<Task[]>;
  private tasks:Task[] = [];

  readonly tasks$:Observable<Task[]>;

  constructor(private http: HttpClient) {
    this.http = http;

    this.tasksSubject = new BehaviorSubject<Task[]>([]);
    this.tasks$ = this.tasksSubject.asObservable();
    this.loadTasks().subscribe((tasks:Task[]) => this.setTasks(tasks));
  }

  addTask(task: Task): void {
    task.createdDate = new Date();

    this.http.post<Task>(`${this.baseUrl}/tasks`, task)
      .pipe(
        map((task) => {
          const newTask = this.deserializeTask(task);
          this.setTasks([... this.tasks, newTask]);
        }),
        catchError(this.handleError<Task>('addTask', undefined))
      ).subscribe();
  }

  deleteTask(taskId?: string): void {
    this.http.delete(`${this.baseUrl}/tasks/${taskId}`)
    .pipe(
      map(() => {
        this.setTasks(this.tasks.filter(task => task.id !== taskId));
      }),
      catchError(this.handleError<boolean>('deleteTask', false))
    ).subscribe();
  }

  private setTasks(tasks:Task[]):void {
      this.tasks = tasks;
      this.tasksSubject.next(tasks);
  }

  private loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`)
      .pipe(
        map((tasks: Task[]) => {
          tasks.forEach((task: Task) => { this.deserializeTask(task) });
          return tasks;
        }),
        catchError(this.handleError<Task[]>('loadTasks', []))
      );
  }

  private deserializeTask(task: any): Task {
    if (task) {
      task.createdDate = this.deserializeDate(task.createdDate);
    }
    return task;
  }

  private deserializeDate(value: any): any {
    if (typeof value === "string" && this.dateFormat.test(value)) {
      return new Date(value);
    }
    return value;
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message:string) {
    console.log(message);
  }
}
