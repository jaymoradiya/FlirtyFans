import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { delay, take } from 'rxjs';
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
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;
  user?: User;
  messages: Message[] = [];
  @ViewChild('memberTabs', { static: true })
  memberTabs!: TabsetComponent;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let userId = this.route.snapshot.params['id'];
    this.route.params.subscribe((p) => (userId = p['id']));

    this.route.data.subscribe({
      next: (data) => {
        this.member = data['member'];
      },
    });

    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    // this.selectedTab = this.route.snapshot.queryParams['tab']?.toLowerCase();
    this.route.queryParams.subscribe({
      next: (params) => {
        this.selectTab(params['tab']);
      },
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
  private selectTab(tab: string) {
    if (this.memberTabs)
      this.memberTabs!.tabs.find(
        (t) => t.heading?.toLowerCase() == tab.toLowerCase()
      )!.active = true;
  }

  addLike() {
    this.userService.addLike(this.member!.id!).subscribe({
      next: (user) => {
        console.log(user);
      },
    });
  }

  goToMessages() {
    this.router.navigate([], {
      queryParams: { tab: 'messages' },
      relativeTo: this.route,
    });
  }
}
