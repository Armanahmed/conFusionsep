import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { RestangularModule, Restangular } from 'ngx-restangular';

import { delay } from 'rxjs/operators';
import { catch } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private restangular: Restangular, private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
  	return this.restangular.all('dishes').getList();
  }

  getDish(id: number): Observable<Dish> {
  	return this.restangular.one('dishes', id).get();
  }

  getFeaturedDish(): Observable<Dish> {
  	return this.restangular.all('dishes').getList({featured: true}).pipe(map(dishes => dishes[0]));
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish.id)),
        catchError(error => error ));
  }

}
