import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { Schedule } from '../schedule';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  schedules: Schedule[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.getSchedules();
  }

  getSchedules(): void {
    this.courseService.getSchedules()
      .subscribe(schedules => this.schedules = schedules);
  }
}