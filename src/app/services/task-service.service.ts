import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Task } from '../models/Task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  readonly baseUrl = "http://localhost:4000";
  readonly dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  constructor(private http: HttpClient) {
    this.http = http;
  }

  addTask(task: Task): Observable<Task> {
    task.createdDate = new Date();
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task)
      .pipe(
        map((task) => {return this.deserializeTask(task)}),
        catchError(this.handleError<Task>('addTask', undefined))
      );
  }

  deleteTask(taskId?: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/tasks/${taskId}`)
    .pipe(
      map(() => {return true}),
      catchError(this.handleError<boolean>('deleteTask', false))
    );
  }

  loadTasks(): Observable<Task[]> {
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
