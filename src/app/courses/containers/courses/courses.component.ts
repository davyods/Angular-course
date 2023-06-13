import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit{

  courses$: Observable<Course[]> | null = null;
    // courses: Course[] = [];


  // coursesService : CoursesService;

  constructor(
    private coursesService : CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
    ) {
    // this.courses = [];
    // this.coursesService = new CoursesService();
      this.refresh();
      // this.courses = this.coursesService.list().subscribe(courses => this.courses = courses);
  }

  refresh(){
    this.courses$ = this.coursesService.list()
      .pipe(
        catchError(error =>{
          this.OnError('Erro ao carregar cursos.');
          return of([])
        })
      );
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

  onRemove(course: Course){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
     if (result) {
      this.coursesService.remove(course._id).subscribe(
        () => {
            this.refresh();
            this.snackBar.open('Curso removido com sucesso!', 'X', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        () => this.OnError('Erro ao tentar remover curso.')
      );
     }
    });
  }

}
