import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Observable, Subscription, switchMap} from "rxjs";
import {HttpService} from "../../../../core/service/http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ItemResponse} from "../../../../shared/models/rest.models";
import {ItemCategoryDTO, ItemDTO, ItemImageDTO, ItemSetDTO} from "../../../../shared/models/dto.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidationService} from "../../../../core/service/form-validation.service";
import {ImageUploadService} from "../../../../core/service/image-upload.service";
import {ImageUploadModel} from "../../../../shared/models/data.models";
import {SnackbarService} from "../../../../core/service/snackbar.service";
import {HttpErrorService} from "../../../../core/service/http-error.service";
import {StorageService} from "../../../../core/service/storage.service";

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
    noImageUploaded: boolean = false;
    itemImages: ItemImageDTO[] = [];
    currentUser;
    selectedItemCategory: ItemCategoryDTO;
    itemCategories: ItemCategoryDTO[] = [];
    selectedItemSet: ItemSetDTO;
    itemSets: ItemSetDTO[] = [];


    constructor(private httpService: HttpService,
                private formBuilder: FormBuilder,
                private formValidationService: FormValidationService,
                private imageUploadService: ImageUploadService,
                private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private storageService: StorageService,
                private route: ActivatedRoute,
                private router: Router) {
        this.currentUser = this.storageService.getUser();

        if (!this.currentUser || !this.currentUser.roles.includes('EMPLOYEE')) {
            this.router.navigate(['/']);
        }

        this.itemForm = this.formBuilder.group({
                title: ['', Validators.required, this.formValidationService.validateField],
                description: ['', Validators.required, this.formValidationService.validateField],
                price: ['', Validators.required, this.formValidationService.validateNumber],
                quantity: ['', Validators.required, this.formValidationService.validateNumber],
                itemCategory: ['', Validators.required],
                itemSet: ['', Validators.required]
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
                    this.itemForm.setValue({
                        title: this.item.title,
                        description: this.item.description,
                        price: this.item.price,
                        quantity: this.item.quantity,
                        itemCategory: this.item.itemCategory,
                        itemSet: this.item.itemSet
                    });
                    itemResponse.items[0].itemImages
                        .forEach((itemImage: ItemImageDTO) => {
                            this.itemImages.push(itemImage);
                        });
                }
            })
        );

        this.allSubscriptions.push(
            this.httpService.getAllItemCategories()
                .subscribe({
                    next: next => {
                        this.itemCategories = next.itemCategories
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );

        this.allSubscriptions.push(
            this.httpService.getAllItemSets()
                .subscribe({
                    next: next => {
                        this.itemSets = next.itemSets
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onSubmitRegistrationForm() {
        if (!this.fileInvalid && this.itemImages.length > 0
            && this.formValidationService.isFormValid(this.itemForm)) {
            this.noImageUploaded = false;
            const itemImagesDTOs: ItemImageDTO[] = [];
            this.itemImages.forEach((itemImage: ItemImageDTO) => {
                const itemImageDTO: ItemImageDTO = {
                    imageId: itemImage.imageId ? itemImage.imageId : 0,
                    imageBase64: itemImage.imageBase64
                };
                itemImagesDTOs.push(itemImageDTO);
            })

            const itemDTO: ItemDTO = {
                itemId: this.item ? this.item.itemId : 0,
                title: this.getFieldValue('title'),
                price: this.getFieldValue('price'),
                quantity: this.getFieldValue('quantity'),
                description: this.getFieldValue('description'),
                itemSet: this.getFieldValue('itemSet'),
                itemCategory: this.getFieldValue('itemCategory'),
                visible: this.item ? this.item.visible : 0,
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
        } else if (this.itemImages.length === 0) {
            this.noImageUploaded = true;
        }
    }

    uploadImage() {
        this.imageUploadService.uploadImage(this.fileInput);
    }

    onFileSelected($event: any) {
        const imageUploadModel: ImageUploadModel = {
            fileInvalid: this.fileInvalid,
            itemImages: this.itemImages
        }
        this.imageUploadService.onFileSelected($event, imageUploadModel);
        this.fileInvalid = imageUploadModel.fileInvalid;
    }

    removeImages() {
        this.itemImages = [];
    }

    private getFieldValue(fieldName: string) {
        return this.itemForm.get(fieldName)?.value;
    }

    setItemVisible() {
        if(this.item) {
            if (this.item.visible === 1) {
                this.item.visible = 0;
            } else {
                this.item.visible = 1;
            }
        }
    }
}
