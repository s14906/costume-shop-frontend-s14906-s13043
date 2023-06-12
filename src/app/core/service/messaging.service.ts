import {ElementRef, Injectable} from "@angular/core";
import {UserDTO} from "../../shared/models/dto.models";
import {HttpService} from "./http/http.service";
import {StorageService} from "./storage.service";
import {SnackbarService} from "./snackbar.service";
import {Subscription} from "rxjs";
import {HttpErrorService} from "./http/http-error.service";
import {ComplaintResponse} from "../../shared/models/rest.models";
import {Router} from "@angular/router";
import {UserModel} from "../../shared/models/data.models";

@Injectable({
    providedIn: 'root'
})
export class MessagingService {
    currentUser: UserModel;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
    }

    public getPostSendComplaintChatMessage(chatMessage: string, complaintId: number,
                                           chatImagesBase64: string[]) {
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
            chatImagesBase64: chatImagesBase64.length > 0 ? chatImagesBase64 : []
        }, complaintId.toString());
    }

    public sendMessage(fileInvalid: boolean, chatTextarea: ElementRef, complaintId: string,
                       allSubscriptions: Subscription[], orderId: string, chatImagesBase64: string[]): void {
        if (!fileInvalid) {
            const chatMessage: string = chatTextarea.nativeElement.value;
            if (chatMessage.length > 10 && chatMessage.length < 1000) {
                if (!complaintId) {
                    allSubscriptions.push(
                        this.httpService.postCreateNewComplaint({
                            userId: this.storageService.getUser().id,
                            orderId: Number(orderId),
                            complaintCategory: 'Damaged item',
                            complaintMessage: chatMessage,
                            complaintChatImagesBase64: chatImagesBase64.length > 0 ? chatImagesBase64 : []
                        }).subscribe(this.getNextFromSendComplaintChatMessageResponse(Number(complaintId))));
                } else {
                    allSubscriptions.push(
                        this.getPostSendComplaintChatMessage(chatMessage, Number(complaintId), chatImagesBase64)
                            .subscribe(this.getNextFromSendComplaintChatMessageResponse(Number(complaintId)))
                    );
                }
            } else {
                this.snackbarService.openSnackBar('Your message length must be between 10 and 1000 characters!');
            }
        } else {
            this.snackbarService.openSnackBar('The attached file is invalid!');
        }
    }

    private getNextFromSendComplaintChatMessageResponse(complaintId: number) {
        return {
            next: next => {
                this.refreshOrRedirectPage(next, complaintId);
            },
            error: err => {
                this.httpErrorService.handleError(err);
            }
        };
    }

    private refreshOrRedirectPage(createNewComplaintResponse: ComplaintResponse, myComplaintId: number): void {
        const finalComplaintId = createNewComplaintResponse.complaintId ?
            createNewComplaintResponse.complaintId : myComplaintId;
        const url: string = this.router.url;
        const index = url.indexOf('?');
        const extractedPath = url.substring(0, index !== -1 ? index : url.length);
        this.snackbarService.openSnackBar(createNewComplaintResponse.message);
        if (!url.includes('orders/complaint')) {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([extractedPath], {
                    queryParams: {
                        complaintId: finalComplaintId
                    }
                });
            });
        } else {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then((): void => {
                this.router.navigate(['complaints/chat'], {
                    queryParams: {
                        complaintId: finalComplaintId
                    }
                });
            });
        }
    }
}
