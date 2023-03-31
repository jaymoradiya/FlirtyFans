import { Component, Input } from '@angular/core';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-member-list-item',
  templateUrl: './member-list-item.component.html',
  styleUrls: ['./member-list-item.component.css'],
})
export class MemberListItemComponent {
  @Input()
  member: Member | undefined = undefined;

  @Input()
  type = MemberListItemType.like;

  get isLikeType() {
    return this.type == MemberListItemType.like;
  }
}
