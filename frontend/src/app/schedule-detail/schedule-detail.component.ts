import { Component, OnInit, Input } from '@angular/core';
import { Schedule } from '../schedule';

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
      });
  }
  
  goBack(): void {
    this.location.back();
  }
}
