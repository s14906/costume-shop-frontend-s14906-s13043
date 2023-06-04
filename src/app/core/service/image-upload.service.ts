import {ElementRef, Injectable} from "@angular/core";
import {SnackbarService} from "./snackbar.service";
import {ImageUploadModel} from "../../shared/models/data.models";

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {
    constructor(private snackbarService: SnackbarService) {
    }
    public uploadImage(fileInput: ElementRef) {
        fileInput.nativeElement.click();
    }

    onFileSelected($event: any, imageUploadModel: ImageUploadModel) {
        const file: File = $event.target?.files[0];
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            imageUploadModel.fileInvalid = false;
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageBase64 = reader.result as string;
                    if (imageUploadModel.itemImages.length > 2) {
                        imageUploadModel.itemImages.shift();
                    }

                    imageUploadModel.itemImages.push({
                        imageId: 0,
                        imageBase64: imageBase64
                    });
                };

                reader.readAsDataURL(file);
            }
        } else {
            imageUploadModel.fileInvalid = true;
            this.snackbarService.openSnackBar("Invalid type file! Select an image of .jpg or .png type.")
        }
    }
}
