import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProvider } from '../providers/firebase/user'; 
import { IUserProfile } from '../user-profile/user-profile.interface';
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.html',
  styleUrls: ['./manage-user.scss'],
})
export class ManageUser implements OnInit {
  public title: string;
  public users: IUserProfile[] = [];
  public result: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public userProvider: UserProvider) {
      this.loadAllUsers();
    }

  ngOnInit() {
      this.activatedRoute
        .data
        .subscribe(v => this.title = v.title);

    // this.title = this.activatedRoute.snapshot.paramMap.get('title');
  }
  
  loadAllUsers() {
    this.userProvider.getItems().then( (res: IUserProfile[]) => {
      console.log(res)
      this.users = res;
    });
  }

  updateRole(key, event) {
    const payload = { role: event.target.value };

    if(event.target.value) {
      this.userProvider.updateItem(payload, key);
    }
  }

  loadUsers(){
    
  }
}
