import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {StorageService} from "../../../core/service/storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {CreateNewComplaintResponse} from "../../../shared/models/rest.models";

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
              private router: Router) {

    this.complaintId = this.storageService.getComplaintIdForUser();
    this.currentUser = this.storageService.getUser();
    this.orderId = this.storageService.getOrderDetails()?.orderId;
  }

  sendMessage() {
    if (!this.fileInvalid) {
      const chatMessage: string = this.chatTextarea.nativeElement.value;
      if (chatMessage.length > 10 && chatMessage.length < 100) {
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
        this.snackbarService.openSnackBar('Your message length must be between 10 and 100 characters!');
      }
    } else {
      this.snackbarService.openSnackBar('The attached file is invalid!');
    }
  }

  private getNextFromSendComplaintChatMessageResponse() {
    return {
      next: next => {
        this.storageService.saveComplaintIdForUser(next.complaintId);
        this.refreshOrRedirectPage(next);
      },
      error: err => {
        this.httpErrorService.handleError(err);
      }
    };
  }

  private refreshOrRedirectPage(createNewComplaintResponse: CreateNewComplaintResponse) {
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
    return this.httpService.postSendComplaintChatMessage({
      chatMessageId: 0,
      chatMessage: chatMessage,
      createdDate: new Date(),
      chatMessageUserName: this.currentUser.name,
      chatMessageUserSurname: this.currentUser.surname,
      complaintId: Number(complaintId),
      chatImagesBase64: this.chatImagesBase64.length > 0 ? this.chatImagesBase64 : []
    }, complaintId.toString());
  }

  onFileSelected($event: any) {
    console.log($event);
    const file: File = $event.target?.files[0];
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      this.fileInvalid = false;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageBase64 = reader.result as string;
          console.log('Base64 string:', imageBase64);
          this.chatImagesBase64.push(imageBase64);
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.fileInvalid = true;
      this.snackbarService.openSnackBar("Invalid type file! Select an image of .jpg or .png type.")
    }
  }


  uploadImage() {
    this.fileInput.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
