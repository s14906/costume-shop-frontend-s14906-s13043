import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Observable, Subscription, switchMap} from "rxjs";
import {HttpService} from "../../../../core/service/http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ItemResponse} from "../../../../shared/models/rest.models";
import {ItemDTO, ItemImageDTO} from "../../../../shared/models/dto.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidationService} from "../../../../core/service/form-validation.service";
import {ImageUploadService} from "../../../../core/service/image-upload.service";
import {ImageUploadModel} from "../../../../shared/models/data.models";
import {SnackbarService} from "../../../../core/service/snackbar.service";
import {HttpErrorService} from "../../../../core/service/http-error.service";

@Component({
    selector: 'app-item-edit',
    templateUrl: './item-edit.component.html',
    styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    @ViewChild('fileInput') fileInput!: ElementRef;

    item?: ItemDTO;
    itemForm: FormGroup;
    fileInvalid: boolean = false;
    imagesBase64: string[] = [];


    constructor(private httpService: HttpService,
                private formBuilder: FormBuilder,
                private formValidationService: FormValidationService,
                private imageUploadService: ImageUploadService,
                private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private route: ActivatedRoute,
                private router: Router) {
        this.itemForm = this.formBuilder.group({
                title: ['', Validators.required, this.formValidationService.validateField],
                description: ['', Validators.required, this.formValidationService.validateField],
                price: ['', Validators.required, this.formValidationService.validateNumber],
                quantity: ['', Validators.required, this.formValidationService.validateNumber],
            },
            {updateOn: "submit"}
        );

        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams: Params) => {
                    const itemId: string = queryParams['itemId'];
                    if (itemId) {
                        return this.httpService.getItemById(itemId);
                    } else {
                        return new Observable<ItemResponse>()
                    }
                })
            ).subscribe((itemResponse: ItemResponse) => {
                if (itemResponse.items) {
                    this.item = itemResponse.items[0];

                }
            })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onSubmitRegistrationForm() {
        if (!this.fileInvalid && this.imagesBase64.length > 0
            && this.formValidationService.isFormValid(this.itemForm)) {
            const itemImagesDTOs: ItemImageDTO[] = [];
            this.imagesBase64.forEach((imageBase64: string) => {
                const itemImageDTO: ItemImageDTO = {
                    imageId: 0,
                    imageBase64: imageBase64
                };
                itemImagesDTOs.push(itemImageDTO);
            })
            const itemDTO: ItemDTO = {
                itemId: 0,
                title: this.getFieldValue('title'),
                price: this.getFieldValue('price'),
                quantity: this.getFieldValue('quantity'),
                description: this.getFieldValue('description'),
                itemImages: itemImagesDTOs
            }

            this.allSubscriptions.push(
                this.httpService.postItem(itemDTO)
                    .subscribe({
                        next: next => {
                            this.router.navigate(['/items']).then((navigated: boolean) => {
                                if (navigated) {
                                    this.snackbarService.openSnackBar(next.message);
                                }
                            });
                        },
                        error: err => {
                            this.httpErrorService.handleError(err);
                        }
                    })
            );
        }
    }

    uploadImage() {
        this.imageUploadService.uploadImage(this.fileInput);
    }

    onFileSelected($event: any) {
        const imageUploadModel: ImageUploadModel = {
            fileInvalid: this.fileInvalid,
            imagesBase64: this.imagesBase64
        }
        this.imageUploadService.onFileSelected($event, imageUploadModel);
        this.fileInvalid = imageUploadModel.fileInvalid;
    }

    removeImages() {
        this.imagesBase64 = [];
    }

    private getFieldValue(fieldName: string) {
        return this.itemForm.get(fieldName)?.value;
    }
}
