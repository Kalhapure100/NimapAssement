import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  user: any={};
  //photoPreview: any;
  interests: string[] = [];
  photoPreview: string | ArrayBuffer | null = null;
  userId: string = '';
  registrationForm!: FormGroup;



  
  constructor(private userService:UserServiceService,private route: ActivatedRoute,private router:Router) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.userService.getUserData(userId).subscribe(userData => {
        this.user = userData;
      });
    });
  }
 
  
editPhoto() {
  this.router.navigate(['/registeration-form'], { state: { userData: this.user, editPhoto: true } });
  }

  editProfile() {
    this.router.navigate(['/registeration-form'], { state: { userData: this.user } });
  }
  agree(){
    this.router.navigate(['/home']);
  }
  
}

