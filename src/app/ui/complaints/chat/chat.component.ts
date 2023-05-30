import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {StorageService} from "../../../core/service/storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";

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

  constructor(private storageService: StorageService,
              private snackbarService: SnackbarService,
              private httpService: HttpService,
              private httpErrorService: HttpErrorService,
              private router: Router) {

    this.complaintId = this.storageService.getComplaintIdForUser();
  }

  sendMessage() {
    if (!this.fileInvalid) {
      const chatMessage: string = this.chatTextarea.nativeElement.value;
      const currentUser = this.storageService.getUser();
      if (chatMessage.length > 10 && chatMessage.length < 100) {
        this.allSubscriptions.push(
          this.httpService.postSendComplaintChatMessage({
            chatMessageId: 0,
            chatMessage: chatMessage,
            createdDate: new Date(),
            chatMessageUserName: currentUser.name,
            chatMessageUserSurname: currentUser.surname,
            complaintId: Number(this.complaintId),
            chatImagesBase64: this.chatImagesBase64.length > 0 ? this.chatImagesBase64 : []
          }, this.complaintId).subscribe({
            next: next => {
              const url: string = this.router.url;
              const index = url.indexOf('?');
              const extractedPath = url.substring(0, index !== -1 ? index : url.length);
              this.snackbarService.openSnackBar(next.message);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([extractedPath], {
                  queryParams: {
                    complaintId: this.complaintId
                  }
                });
              });
            }, error: err => {
              this.httpErrorService.handleError(err);
            }
          })
        );
      } else {
        this.snackbarService.openSnackBar('Your message length must be between 10 and 100 characters!');
      }
    }
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
