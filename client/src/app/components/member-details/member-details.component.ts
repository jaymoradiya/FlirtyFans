import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { Member } from 'src/app/models/member.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent {
  member: Member | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService) {
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
}
