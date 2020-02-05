import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('fform')commentFormDirective;
  commentForm:FormGroup;
  comment:Comment;
  dishIds: string[];
  prev: string;
  next: string;
  dish: Dish;
  formErrors={
  'author':'',
  'comment':''
  };
    validationMessages={
      'author':{
      'required':'Author Name is Required',
      'minlength':'Author Name minlength is 2',
      'maclength':'Author Name maxlength is 10' 
      },
      'comment':{
        'required':'Comment is Required',
        'minlength':'Commen minlength is 2',
        'maclength':'Comment maxlength is 10' 
      },
    }

  constructor(private dishService:DishService,
    private location:Location,
    private route:ActivatedRoute,
    private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

     createForm():void{
      this.commentForm = this.fb.group({
        author:['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
        rating:'',
        comment:['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]]
      });
      this.commentForm.valueChanges
           .subscribe(data=>this.onValueChanged(data));
      this.onValueChanged();      
    
     }

     onValueChanged(data?: any){
      if(!this.commentForm){ return;}
      const form = this.commentForm;
      for(const field in this.formErrors){
        if(this.formErrors.hasOwnProperty(field)){
          // clear previous error message (if any)
          this.formErrors[field]='';
          const control = form.get(field);
          if(control && control.dirty && !control.valid){
            const messages = this.validationMessages[field];
            for (const key in control.errors){
              if(control.errors.hasOwnProperty(key)){
                this.formErrors[field]+=messages[key] + ' ';
              }
            }
          }
        }
      }
     }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  goBack():void{
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  onSubmit(){
    let start = new Date()
    this.comment = this.commentForm.value;
    console.log(this.comment);
    console.log(start.toISOString())
    this.dish.comments.push();
    this.commentForm.reset({
     author:"",
     rating:"",
     comment:""
    });
    this.commentFormDirective.resetForm();
  }

}
