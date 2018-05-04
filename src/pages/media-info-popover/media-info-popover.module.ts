import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaInfoPopoverPage } from './media-info-popover';

@NgModule({
  declarations: [
    MediaInfoPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaInfoPopoverPage),
  ],
})
export class MediaInfoPopoverPageModule {}
