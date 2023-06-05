import {CartItemDTO} from "./dto.models";

export interface ItemSizeModel {
    id: number;
    size: string;
}

export interface ItemColorModel {
    id: number;
    color: string;
}

export interface UserModel {
    id: number;
    email: string;
    username: string;
    emailVerified: number;
    name: string;
    surname: string
    phone: string;
    roles: string[];
}

export interface ImageUploadModel {
    fileInvalid: boolean;
    itemImagesBase64: string[];
}

export interface CartDataModel {
    cartItems: CartItemDTO[],
    totalPrice: number,
    priceTimesItemCount: number[]
}

export interface CartConfirmationDataModel {
    cartItems: CartItemDTO[],
    totalPrice: number,
}


