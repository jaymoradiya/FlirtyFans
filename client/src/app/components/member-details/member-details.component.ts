import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent {
  member: Member | undefined;
  user?: User;
  messages: Message[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.loadMessages();
        }
      },
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let userId = route.snapshot.params['id'];
    this.route.params.subscribe((p) => (userId = p['id']));
    this.userService.getMember(userId).subscribe({
      next: (res) => (this.member = res.data),
    });
  }

  getGalleryItem() {
    return this.member?.photos.map(
      (photo) =>
        new ImageItem({
          src: photo.url,
          thumb: photo.url,
          alt: this.member?.knownAs,
        })
    );
  }

  loadMessages() {
    this.messageService.createHubConnection(this.user!, this.member?.id!);

    this.messageService.messageThread$.subscribe({
      next: (messages) => {
        this.messages = messages;
      },
    });
  }
}
