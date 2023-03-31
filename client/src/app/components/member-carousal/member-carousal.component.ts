import { Component, Input } from '@angular/core';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-member-carousal',
  templateUrl: './member-carousal.component.html',
  styleUrls: ['./member-carousal.component.css'],
})
export class MemberCarousalComponent {
  @Input()
  members: Member[] = [];

  get carousalMembers() {
    return Array.from(
      {
        length: 3,
      },
      (_, idx) => ++idx
    );
  }
}
