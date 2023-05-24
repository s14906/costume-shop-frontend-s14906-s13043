import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {ComplaintChatMessageDTO} from "../../../shared/models/dto.models";
import {TokenStorageService} from "../../../core/service/token-storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {formatDate, sortArrayByDateDesc} from 'src/app/shared/utils';

@Component({
    selector: 'app-complaints-chat',
    templateUrl: './complaints-chat.component.html',
    styleUrls: ['./complaints-chat.component.css']
})
export class ComplaintsChatComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    complaintId: string;
    complaintChatMessages: ComplaintChatMessageDTO[] = [];
    chatImagesBase64: string[] = [];
    fileInvalid: boolean = false;
    @ViewChild('fileInput') fileInput!: ElementRef;
    @ViewChild('chatTextarea') chatTextarea!: ElementRef;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private tokenStorageService: TokenStorageService,
                private snackbarService: SnackbarService,
                private router: Router) {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams) => {
                        this.complaintId = queryParams['complaintId'];
                        return this.httpService.getComplaint(this.complaintId).pipe(
                            switchMap((complaint) =>
                                this.httpService.getComplaintChatMessages(complaint.complaintId)
                            )
                        );
                    }
                )
            ).subscribe(({
                next: next => {
                    this.complaintChatMessages = sortArrayByDateDesc(next);
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            })));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    sendMessage() {
        if (!this.fileInvalid) {
            const chatMessage: string = this.chatTextarea.nativeElement.value;
            const currentUser = this.tokenStorageService.getUser();
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
                            this.snackbarService.openSnackBar(next.message);
                            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                                this.router.navigate(['complaints/chat'], {
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

    formatDate(createdDate: Date): string {
        return formatDate(createdDate);
    }
}
