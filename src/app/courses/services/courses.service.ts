import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Course } from '../model/course';
import { delay, first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private httpClient: HttpClient) { }

  list() {
   return this.httpClient.get<Course[]>(this.API)
   .pipe(
      first(),
      //delay(3000),
      tap(courses => console.log(courses))
   );
  }

  loadById(id: string){
   return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  save(record: Partial<Course>) {
    //console.log(record);
    if (record._id){
      //onsole.log('update');
      return this.update(record);
    }
    //console.log('create');
    return this.create(record);
  }

  private create(record: Partial<Course>){
    return this.httpClient.post<Course>(this.API, record);
  }

  private update(record: Partial<Course>){
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record);
  }
}
