import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {StorageService} from "../../../core/service/storage.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ImageUploadService} from "../../../core/service/image/image-upload.service";
import {ImageUploadModel} from "../../../shared/models/data.models";
import {MessagingService} from "../../../core/service/messaging.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy {
  private allSubscriptions: Subscription[] = [];

  chatImagesBase64: string[] = [];
  fileInvalid: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('chatTextarea') chatTextarea!: ElementRef;

  complaintId: string;
  currentUser;
  orderId: string;

  constructor(private storageService: StorageService,
              private imageUploadService: ImageUploadService,
              private route: ActivatedRoute,
              private messagingService: MessagingService) {

    this.allSubscriptions.push(
      this.route.queryParams.subscribe(queryParam => {
      this.complaintId = queryParam['complaintId']
    }));

    this.currentUser = this.storageService.getUser();
    this.orderId = this.storageService.getOrderDetails()?.orderId;
  }

  sendMessage() {
    this.messagingService.sendMessage(this.fileInvalid, this.chatTextarea, this.complaintId, this.allSubscriptions,
        this.orderId, this.chatImagesBase64);
  }



  onFileSelected($event: any) {
    const imageUploadModel: ImageUploadModel = {
      fileInvalid: this.fileInvalid,
      itemImagesBase64: this.chatImagesBase64
    }
    this.imageUploadService.onFileSelected($event, imageUploadModel);
  }


  uploadImage() {
    this.imageUploadService.uploadImage(this.fileInput);
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  removeImages() {
    this.chatImagesBase64 = [];
  }
}
