import {Injectable} from "@angular/core";
import {HttpService} from "./http/http.service";
import {StorageService} from "./storage.service";
import {SnackbarService} from "./snackbar.service";
import {ItemDTO, ItemImageDTO} from "../../shared/models/dto.models";
import {ItemSizeModel} from "../../shared/models/data.models";
import {FormValidationService} from "./form/form-validation.service";
import {FormGroup} from "@angular/forms";
import {HttpErrorService} from "./http/http-error.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SimpleResponse} from "../../shared/models/rest.models";

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private formValidationService: FormValidationService,
                private httpErrorService: HttpErrorService,
                private snackbarService: SnackbarService,
                private router: Router) {
    }

    addToCart(item: ItemDTO | undefined, itemSizes: ItemSizeModel[], itemAmount: number, selectedItemSize: string): void {
        this.httpService.postAddToCart({
            userId: this.storageService.getUser().id,
            itemId: item?.itemId,
            itemSizeId: itemSizes.find(itemSize => itemSize.size === selectedItemSize)?.id,
            itemAmount: itemAmount
        }).subscribe({
            next: (next: SimpleResponse): void => {
                this.snackbarService.openSnackBar(next.message);
            },
            error: err => {
                this.snackbarService.openSnackBar(err.error.message);
            }
        });
    }

    insertOrUpdateItem(itemImagesBase64: string[], itemForm: FormGroup, item: ItemDTO | undefined,
                       allSubscriptions: Subscription[]): void {
        const itemImagesDTOs: ItemImageDTO[] = [];
        itemImagesBase64.forEach((itemImageBase64: string): void => {
            const itemImageDTO: ItemImageDTO = {
                imageId: 0,
                imageBase64: itemImageBase64
            };
            itemImagesDTOs.push(itemImageDTO);
        })

        const itemDTO: ItemDTO = {
            itemId: item ? item.itemId : 0,
            title: this.formValidationService.getFieldValue(itemForm, 'title'),
            price: this.formValidationService.getFieldValue(itemForm, 'price'),
            quantity: this.formValidationService.getFieldValue(itemForm, 'quantity'),
            description: this.formValidationService.getFieldValue(itemForm, 'description'),
            itemSet: this.formValidationService.getFieldValue(itemForm, 'itemSet'),
            itemCategory: this.formValidationService.getFieldValue(itemForm, 'itemCategory'),
            visible: item ? item.visible : 0,
            itemImages: itemImagesDTOs
        }

        allSubscriptions.push(
            this.httpService.postItem(itemDTO)
                .subscribe({
                    next: (next: SimpleResponse): void => {
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
