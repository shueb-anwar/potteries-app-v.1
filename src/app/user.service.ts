import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    public userProfileData = new Subject();

	constructor() { }


    setUserProfileData(value) {
        this.userProfileData.next(value);
    }

}