import { Component, OnInit,Inject } from '@angular/core';
import {Leader} from '../shared/leader';
import {LeadersService} from '../services/leaders.service';
import { flyInOut,expand } from '../animations/app.animation';
import {baseURL} from '../shared/baseurl';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class AboutComponent implements OnInit {
    leader:Leader[];


  constructor(private leaderservice:LeadersService, @Inject('BaseURL') private BaseURL) { 
    
  }

  ngOnInit() {
    this.leaderservice.getLeaders().subscribe((leader)=>this.leader = leader);
  }

}
