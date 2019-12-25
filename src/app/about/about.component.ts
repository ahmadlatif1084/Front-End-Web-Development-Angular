import { Component, OnInit } from '@angular/core';
import {Leader} from '../shared/leader';
import {LeadersService} from '../services/leaders.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    leader:Leader[];

  constructor(private leaderservice:LeadersService) { 
    
  }

  ngOnInit() {
    this.leader = this.leaderservice.getLeaders();
  }

}
