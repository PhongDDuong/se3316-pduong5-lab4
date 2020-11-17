import { Injectable } from '@angular/core';
import { Course } from './course';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesUrl = 'http://localhost:3000/api/courses';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  getCourses(): Observable<Course[]> {
    console.log(COURSES);
    return of(COURSES);
  }*/
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
  
  getCourses(): Observable<Course[]> {
    this.messageService.add('HeroService: fetched courses');
    return this.http.get<Course[]>(this.coursesUrl)
    .pipe(
      tap(_ => this.log('fetched courses')),
      catchError(this.handleError<Course[]>('getCourses', []))
    );
  }

  getCourse(catalog_nbr: string): Observable<Course> {
    const url = `${this.coursesUrl}/${catalog_nbr}`;
    return this.http.get<Course>(url).pipe(
      tap(_ => this.log(`fetched catalog_nbr=${catalog_nbr}`)),
      catchError(this.handleError<Course>(`getHero id=${catalog_nbr}`))
    );
  }

  searchCourses(term: string): Observable<Course[]> {
    var input = term.split(",");
    console.log(input);
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Course[]>(`${this.coursesUrl}/?subject=${input[0]}&catalog_nbr=${input[1]}&ssr_component=${input[2]}`).pipe(
      tap(x => x.length ?
         this.log(`found courses matching "${term}"`) :
         this.log(`no courses matching "${term}"`)),
      catchError(this.handleError<Course[]>('searchCourses', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`CourseService: ${message}`);
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }
}
