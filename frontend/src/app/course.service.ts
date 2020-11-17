import { Injectable } from '@angular/core';
import { Course } from './course';
import { COURSES } from './mock-courses';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesUrl = 'http://localhost:3000/api/courses';

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl)
  }

  getCourse(id: number): Observable<Course> {
    // TODO: send the message _after_ fetching the hero
    this.messageService.add(`CourseService: fetched course id=${id}`);
    return of(COURSES.find(course => course.id === id));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }
}
