import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {StorageService} from "../../../core/service/storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {ComplaintResponse} from "../../../shared/models/rest.models";
import {UserDTO} from "../../../shared/models/dto.models";
import {ImageUploadService} from "../../../core/service/image-upload.service";
import {ImageUploadModel} from "../../../shared/models/data.models";

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
              private snackbarService: SnackbarService,
              private httpService: HttpService,
              private httpErrorService: HttpErrorService,
              private imageUploadService: ImageUploadService,
              private route: ActivatedRoute,
              private router: Router) {

    this.allSubscriptions.push(
      this.route.queryParams.subscribe(queryParam => {
      this.complaintId = queryParam['complaintId']
    }));


    this.currentUser = this.storageService.getUser();
    this.orderId = this.storageService.getOrderDetails()?.orderId;
  }

  sendMessage() {
    if (!this.fileInvalid) {
      const chatMessage: string = this.chatTextarea.nativeElement.value;
      if (chatMessage.length > 10 && chatMessage.length < 1000) {
        if (!this.complaintId) {
          this.allSubscriptions.push(
            this.httpService.postCreateNewComplaint({
              userId: this.storageService.getUser().id,
              orderId: Number(this.orderId),
              complaintCategory: 'Damaged item',
              complaintMessage: chatMessage
            }).subscribe(this.getNextFromSendComplaintChatMessageResponse()));
        } else {
          this.allSubscriptions.push(
            this.getPostSendComplaintChatMessage(chatMessage, Number(this.complaintId))
              .subscribe(this.getNextFromSendComplaintChatMessageResponse())
          );
        }
      } else {
        this.snackbarService.openSnackBar('Your message length must be between 10 and 1000 characters!');
      }
    } else {
      this.snackbarService.openSnackBar('The attached file is invalid!');
    }
  }

  private getNextFromSendComplaintChatMessageResponse() {
    return {
      next: next => {
        this.refreshOrRedirectPage(next);
      },
      error: err => {
        this.httpErrorService.handleError(err);
      }
    };
  }

  private refreshOrRedirectPage(createNewComplaintResponse: ComplaintResponse) {
    const complaintId = createNewComplaintResponse.complaintId ?
      createNewComplaintResponse.complaintId : this.complaintId;
    const url: string = this.router.url;
    const index = url.indexOf('?');
    const extractedPath = url.substring(0, index !== -1 ? index : url.length);
    this.snackbarService.openSnackBar(createNewComplaintResponse.message);
    if (!url.includes('orders/complaint')) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([extractedPath], {
          queryParams: {
            complaintId: complaintId
          }
        });
      });
    } else {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['complaints/chat'], {
          queryParams: {
            complaintId: complaintId
          }
        });
      });
    }

  }

  private getPostSendComplaintChatMessage(chatMessage: string, complaintId: number) {
    const userDTO: UserDTO = {
      id: this.currentUser.id,
      roles: this.currentUser.roles,
      name: this.currentUser.name,
      surname: this.currentUser.surname
    }
    return this.httpService.postSendComplaintChatMessage({
      chatMessageId: 0,
      chatMessage: chatMessage,
      createdDate: new Date(),
      user: userDTO,
      complaintId: Number(complaintId),
      chatImagesBase64: this.chatImagesBase64.length > 0 ? this.chatImagesBase64 : []
    }, complaintId.toString());
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
