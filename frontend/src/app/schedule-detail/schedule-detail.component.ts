import { Component, OnInit, Input } from '@angular/core';
import { Schedule } from '../schedule';
import { Course } from '../course';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CourseService } from '../course.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {
  @Input() schedule: Schedule;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) {}

  courses: Course[];
  matchingCourses = [];

  ngOnInit(): void {
    this.getSchedule();
  }

  deleteSchedule(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.courseService.deleteSchedule(name)
      .subscribe(schedule => {
        this.goBack();
      });
  }

  getSchedule(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.courseService.getSchedule(name)
      .subscribe(schedule => {
        this.schedule = schedule[0];
        this.getCourses();
      });
  }

  getCourses(): void {
    this.courseService.getCourses()
        .subscribe(courses => {
          this.courses = courses;
          this.getScheduleCourses();
        })
  }

  getScheduleCourses(): void{
    //console.log(this.courses[0].catalog_nbr);
    var catnum = this.schedule.catalog_nbr.split(",");
    var subjects = this.schedule.subject.split(",");
    for (let i = 0; i < catnum.length; i++) {
      for(var course of this.courses){
        if(course.catalog_nbr.toString()==catnum[i] && course.subject==subjects[i]){
          this.matchingCourses.push(course);
        }
      }
    }
  }
  
  goBack(): void {
    this.location.back();
  }
}
