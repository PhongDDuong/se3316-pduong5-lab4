import { Component, OnInit } from '@angular/core';

import { Course } from '../course';
import { CourseService } from '../course.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[];
  schedules: [];

  constructor(private courseService: CourseService, private messageService: MessageService) {}

  getSchedule(): void {
    this.courseService.getSchedules()
        .subscribe(schedules => {
          console.log(schedules)
          this.schedules = schedules;
        })
        
  }

  getCourses(): void {
    this.courseService.getCourses()
        .subscribe(courses => {
          console.log(courses)
          this.courses = courses;
        })
        
  }

  ngOnInit() {
    this.getCourses();
    this.getSchedule();
    console.log(this.schedules);
  }

}
