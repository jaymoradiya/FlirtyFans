import { Component, Input } from '@angular/core';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';
import { Thread } from 'src/app/models/thread.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-list-item',
  templateUrl: './member-list-item.component.html',
  styleUrls: ['./member-list-item.component.css'],
})
export class MemberListItemComponent {
  @Input()
  data: Member | Thread | undefined = undefined;

  @Input()
  type = MemberListItemType.like;

  get isLikeType() {
    return this.type == MemberListItemType.like;
  }
  get member() {
    return this.isLikeType ? (this.data as Member) : null;
  }

  get thread() {
    const data = !this.isLikeType ? (this.data as Thread) : null;
    if (data) {
      return {
        id: data.otherUserId,
        userKnownAs:
          data.otherUserId == data.lastMessage.senderId
            ? data.lastMessage.senderKnownAs
            : data.lastMessage.recipientKnownAs,

        userPhotoUrl:
          data.otherUserId == data.lastMessage.senderId
            ? data.lastMessage.senderUserPhotoUrl
            : data.lastMessage.recipientUserPhotoUrl,
        lastMessage: data.lastMessage,
      };
    }
    return;
  }

  constructor(private userService: UserService) {}

  addLike() {
    this.userService.addLike((this.data! as Member).id).subscribe({
      next: (user) => {
        console.log(user);
      },
    });
  }
}
