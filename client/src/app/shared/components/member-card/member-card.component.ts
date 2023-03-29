import { Component, Input } from '@angular/core';
import { Member } from 'src/app/models/member.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent {
  @Input()
  member: Member | undefined;
}
