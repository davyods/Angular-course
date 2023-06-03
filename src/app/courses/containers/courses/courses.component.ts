import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit{

  courses$: Observable<Course[]>;
    // courses: Course[] = [];


  // coursesService : CoursesService;

  constructor(
    private coursesService : CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
    ) {
    // this.courses = [];
    // this.coursesService = new CoursesService();

      this.courses$ = this.coursesService.list()
      .pipe(
        catchError(error =>{
          this.OnError('Erro ao carregar cursos.');
          return of([])
        })
      );

      // this.courses = this.coursesService.list().subscribe(courses => this.courses = courses);
  }

  OnError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  ngOnInit(): void {

  }

  onAdd(){
    console.log('teste')
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onEdit(course: Course){
    this.router.navigate(['edit', course._id], {relativeTo: this.route});
  }
}
