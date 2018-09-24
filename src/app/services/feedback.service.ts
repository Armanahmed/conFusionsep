import { Injectable } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';

import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { RestangularModule, Restangular } from 'ngx-restangular';

import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private restangular: Restangular) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
  	return this.restangular.all('feedback').post(feedback);
  }

}
