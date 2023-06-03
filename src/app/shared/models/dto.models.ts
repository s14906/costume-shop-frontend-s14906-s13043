export interface ComplaintDTO {
    complaintId: number;
    buyerId: number;
    employeeId: number;
    buyerName: string;
    buyerSurname: string;
    employeeName: string;
    employeeSurname: string;
    complaintStatus: string;
    createdDate: Date;
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
    notes?: string;
}

export interface CartItemDTO {
    cartItemId: number;
    title: string;
    items: ItemWithImageDTO[];
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
    id?: number;
    email?: string;
    password?: string;
    username?: string;
    emailVerified?: number;
    name?: string;
    surname?: string;
    token?: string;
    phone?: string;
    roles?: string[];
}

export interface ComplaintChatMessageDTO {
    chatMessageId: number;
    complaintId: number;
    user: UserDTO;
    chatMessage: string;
    createdDate: Date;
    chatImagesBase64: string[];

}

export interface OrderDTO {
    orderId: string;
    user: UserDTO;
    orderStatus: string;
    createdDate: Date;
    totalPrice: number;
    address?: AddressDTO;
    ordersDetails?: OrderDetailsDTO[];
}

export interface OrderDetailsDTO {
    orderDate: Date;
    orderId: number;
    complaint: ComplaintDTO;
    buyerId: number;
    items: ItemWithImageDTO[];
}

export interface CreateNewComplaintDTO {
    userId: number;
    orderId: number;
    complaintCategory: string;
    complaintMessage?: string;
}

export interface PaymentTransactionDTO {
    userId: number;
    orderId: number;
    paidAmount: number;
}

export interface CartConfirmationDTO {
    userId: number;
    paidAmount: number;
    address: AddressDTO;
    cartItems: CartItemDTO[];
}
