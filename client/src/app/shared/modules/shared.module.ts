import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GALLERY_CONFIG, GalleryModule } from 'ng-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    GalleryModule,
    NgxSpinnerModule.forRoot({
      type: 'fire',
    }),
    FileUploadModule,
  ],
  providers: [
    {
      provide: GALLERY_CONFIG,
      useValue: {
        imageSize: 'cover',
        loop: true,
        autoPlay: true,
        dots: true,
        counter: false,
      },
    },
  ],
  exports: [
    ToastrModule,
    BsDropdownModule,

    TabsModule,
    GalleryModule,
    NgxSpinnerModule,
    FileUploadModule,
  ],
})
export class SharedModule {}
