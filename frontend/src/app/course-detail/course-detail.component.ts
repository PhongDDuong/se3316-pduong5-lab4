import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  @Input() course: Course;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getCourse();
  }

  getCourse(): void {
    const catalog_nbr = this.route.snapshot.paramMap.get('catalog_nbr');
    this.courseService.getCourse(catalog_nbr)
      .subscribe(course => {
        console.log(course);
        this.course = course;
      });
  }
  
  goBack(): void {
    this.location.back();
  }
}