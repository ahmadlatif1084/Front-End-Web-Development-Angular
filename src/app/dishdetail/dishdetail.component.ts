import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
// import { trigger, state, style, animate, transition } from '@angular/animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  // animations: [
  //   trigger('visibility', [
  //       state('shown', style({
  //           transform: 'scale(1.0)',
  //           opacity: 1
  //       })),
  //       state('hidden', style({
  //           transform: 'scale(0.5)',
  //           opacity: 0
  //       })),
  //       transition('* => *', animate('0.5s ease-in-out'))
  //   ])
  // ]
})
export class DishdetailComponent implements OnInit {

  

  @ViewChild('fform')commentFormDirective;
  commentForm:FormGroup;
  comment:Comment;
  dishIds: string[];
  prev: string;
  next: string;
  dish: Dish;
  visibility:'shown';
  formErrors={
  'author':'',
  'comment':''
  };
  errMess: string;
  dishcopy: Dish;
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
    this.createForm();
    this.dishService.getDishIds()
        .subscribe(dishIds => this.dishIds = dishIds);
        this.route.params
             .pipe(switchMap((params:Params)=> this.dishService.getDish(params['id'])))
             .subscribe(dish=>{this.dish = dish; this.dishcopy = dish ; this.setPrevNext(dish.id);},
             errmess=>this.errMess= <any>errmess);
  
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
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.comment.date = new Date().toISOString();
     this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
         .subscribe(dish=>{
           this.dish = dish; this.dishcopy = dish;
         },
         errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess}
         )
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
     author:'',
     rating:5,
     comment:''
    });
  }

}
