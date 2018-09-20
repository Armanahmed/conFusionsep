import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  
  
  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  comment: Comment;
  errMess: string;

  commentForm: FormGroup;
  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  }
  validationMessages = {
    'author': {
      'required': 'Author Name is required',
      'minlength': 'Author Name must be at least 2 characters long',
      'maxlength': 'Author Name cannot be more than 25 characters long'
    },
    'rating': {
      'required': 'Rating is required'
    },
    'comment': {
      'required': 'Comment is required'
    }

  }

  constructor(private dishservice: DishService, private route: ActivatedRoute, private location: Location, private fb: FormBuilder, @Inject('BaseURL') private BaseURL) { 
    
  }

  ngOnInit() {

    this.createForm();

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

  	this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(+params['id'])))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); }, errMess => this.errMess = errMess);
  }

  createForm(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: [5, [Validators.required]],
      comment: ['', [Validators.required]]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();    //(re)set form validation messages
  }

  onValueChanged(data?: any) {
    if(!this.commentForm) { return }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }


  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
  	this.location.back();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);

    this.dishcopy.comments.push(this.comment); // push new comment to comment array
        
    

    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: ''
    });
    
  }

}
