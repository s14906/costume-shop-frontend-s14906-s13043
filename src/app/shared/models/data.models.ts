import {ItemImageDTO} from "./dto.models";

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
}

export interface ImageUploadModel {
    fileInvalid: boolean;
    itemImages: ItemImageDTO[];
}


