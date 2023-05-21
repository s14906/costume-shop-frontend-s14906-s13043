export interface ComplaintDTO {
    complaintId: number;
    buyerId: number;
    employeeId: number;
    buyerName: string;
    buyerSurname: string;
    employeeName: string;
    employeeSurname: string;
    complaintStatus: string;
}

export interface ItemWithImageDTO {
    itemId: number;
    title: string;
    description: string;
    price: number;
    itemImages: ItemImageDTO[];
}

export interface ItemImageDTO {
    imageId: number;
    imageBase64: string;
}

export interface UserRegistrationDTO {
    email?: string;
    username?: string;
    name?: string;
    surname?: string;
    password?: string;
    address: AddressDTO;
    phone?: string;
}

export interface AddressDTO {
    addressId: number;
    userId?: number;
    street: string;
    postalCode: string;
    city: string;
    flatNumber: string;
}

export interface CartItemDTO {
    title: string;
    itemsAmount: number;
    price: number;
    size: string;
}

export interface AddToCartDTO {
    itemId?: number;
    itemSizeId?: number;
    userId?: number;
    itemAmount?: number;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}

export interface UserDTO {
    id: number;
    email: string;
    password: string;
    username: string;
    emailVerified: number;
    name: string;
    surname: string;
    token: string;
    phone: string;
    roles: string[];
}
