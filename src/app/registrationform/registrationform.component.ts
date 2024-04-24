
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
//import { faCoffee, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-registrationform',
  templateUrl: './registrationform.component.html',
  styleUrls: ['./registrationform.component.scss']
})
export class RegistrationformComponent{
  @Output() interestsChanged = new EventEmitter<string[]>();
  registrationForm!: FormGroup;
  photoPreview: any;
  userData: any; 
 
 countries: string[] = ['USA', 'Canada', 'UK', 'Australia', 'India'];
 //states: string[] = ['California', 'New York', 'Texas', 'Florida', 'Ontario', 'Quebec', 'Alberta', 'New South Wales', 'Victoria'];
  constructor(private formBuilder: FormBuilder,private router:Router, private userService: UserServiceService,) {}
  ngOnInit(): void {
    // Initialize form
    this.registrationForm = this.formBuilder.group({
      photoUrl: ['', [Validators.required, Validators.pattern('^(https?://.*\\.(?:png|jpg))(\\?w=310&h=325)?$')]],

      age: [18,[Validators.required]],
      interest: ['',[Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{1,20}$')]],
      lastName: ['',[Validators.required]],
      email: ['',[Validators.required]],
      country: ['',[Validators.required]],
      //state: ['',[Validators.required]],
      addressType: [''],
      address1: [''],
      address2: [''],
      companyAddress1: [''],
      companyAddress2: ['']
    });

    // Retrieve user data from router state
    this.userData = history.state.userData;
    if (this.userData) {
      // Populate form fields with user data
      this.registrationForm.patchValue({
        photoUrl: this.userData.photoUrl,
        age: this.userData.age,
        interest: this.userData.interest,
        firstName: this.userData.firstName,
        email: this.userData.email,
        lastName: this.userData.lastName,
        country: this.userData.country,
        state: this.userData.state,
        addressType: this.userData.addressType,
        address1: this.userData.address1,
        address2: this.userData.address2,
        companyAddress1: this.userData.companyAddress1,
        companyAddress2: this.userData.companyAddress2
      });
    }
  }
  
  


  previewPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.registrationForm.patchValue({
        photo: file 
      });
    }
  }

  validateImage(file: File) {
    return new Promise((resolve, reject) => {
      if (!this.isValidFileType(file.type)) {
        reject('Invalid file type. Please upload an image (jpg, jpeg, png)');
        return;
      }
      if (file.size > this.maxSize) {
        reject('Image size is too large. Please upload an image under 1MB');
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (img.width < this.minWidth || img.height < this.minHeight) {
          reject(`Image dimensions are too small. Minimum width: ${this.minWidth}px, Minimum height: ${this.minHeight}px`);
        } else {
          resolve(true);
        }
      };
      img.onerror = (err) => reject('Failed to load image');
      img.src = URL.createObjectURL(file);
    });
  }


  isValidFileType(type: string) {
    const validTypes = ['image/jpeg', 'image/png'];
    return validTypes.includes(type);
  }
  
  toggleAddressFields() {
    const addressType = this.registrationForm.get('addressType')?.value;
    if (addressType === 'Home') {
      this.registrationForm.get('companyAddress1')?.reset();
      this.registrationForm.get('companyAddress2')?.reset();
    } else if (addressType === 'Company') {
      this.registrationForm.get('address1')?.reset();
      this.registrationForm.get('address2')?.reset();
    }
  }

 submitForm() {
    if (this.registrationForm.valid) { 
      const formData = this.registrationForm.value;
      // Here, you would typically submit the formData to the server
      // For demonstration purposes, let's assume submission was successful
      this.userService.createUser(formData).subscribe(newUser => {
        // Navigate to profile component with the new user's ID
        this.router.navigate(['/profile', newUser.id]);
      });
  
      // Clear the form after submission
      this.registrationForm.reset();
    } else {
      // Mark all fields as touched to display validation errors
      this.registrationForm.markAllAsTouched();
    }
  }
  
  cancel(){
    this.router.navigate(['/home']);
  }
}
