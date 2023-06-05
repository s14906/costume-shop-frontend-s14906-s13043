import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {of, Subscription, switchMap} from "rxjs";
import {HttpService} from "../../../../core/service/http/http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ItemCategoryDTO, ItemDTO, ItemImageDTO, ItemSetDTO} from "../../../../shared/models/dto.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidationService} from "../../../../core/service/form/form-validation.service";
import {ImageUploadService} from "../../../../core/service/image/image-upload.service";
import {ImageUploadModel, UserModel} from "../../../../shared/models/data.models";
import {HttpErrorService} from "../../../../core/service/http/http-error.service";
import {StorageService} from "../../../../core/service/storage.service";
import {ItemService} from "../../../../core/service/item.service";
import {ItemResponse} from "../../../../shared/models/rest.models";

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
    itemImagesBase64: string[] = [];
    currentUser: UserModel;
    itemCategories: ItemCategoryDTO[] = [];
    itemSets: ItemSetDTO[] = [];


    constructor(private httpService: HttpService,
                private formBuilder: FormBuilder,
                private formValidationService: FormValidationService,
                private imageUploadService: ImageUploadService,
                private itemService: ItemService,
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
                        return of(null);
                    }
                })
            ).subscribe({
                    next: (next: ItemResponse | null): void => {
                        if (next === null) {
                            this.router.navigate(['/']);
                        } else {
                            if (next.items) {
                                this.item = next.items[0];
                                this.itemForm.setValue({
                                    title: this.item.title,
                                    description: this.item.description,
                                    price: this.item.price,
                                    quantity: this.item.quantity,
                                    itemCategory: this.item.itemCategory,
                                    itemSet: this.item.itemSet
                                });
                                next.items[0].itemImages
                                    .forEach((itemImage: ItemImageDTO): void => {
                                        this.itemImagesBase64.push(itemImage.imageBase64);
                                    });
                            }
                        }
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                        this.router.navigate(['/']);
                    }
                }
            )
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
                    next: (next: ItemResponse): void => {
                        this.itemSets = next.itemSets
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    onSubmitItemForm(): void {
        if (!this.fileInvalid && this.itemImagesBase64.length > 0
            && this.formValidationService.isFormValid(this.itemForm)) {
            this.noImageUploaded = false;
            this.itemService.insertOrUpdateItem(this.itemImagesBase64, this.itemForm, this.item, this.allSubscriptions);


        } else if (this.itemImagesBase64.length === 0) {
            this.noImageUploaded = true;
        }
    }

    uploadImage(): void {
        this.imageUploadService.uploadImage(this.fileInput);
    }

    onFileSelected($event: any): void {
        const imageUploadModel: ImageUploadModel = {
            fileInvalid: this.fileInvalid,
            itemImagesBase64: this.itemImagesBase64
        }
        this.imageUploadService.onFileSelected($event, imageUploadModel);
        this.fileInvalid = imageUploadModel.fileInvalid;
    }

    removeImages(): void {
        this.itemImagesBase64 = [];
    }

    setItemVisible(): void {
        if (this.item) {
            if (this.item.visible === 1) {
                this.item.visible = 0;
            } else {
                this.item.visible = 1;
            }
        }
    }
}
