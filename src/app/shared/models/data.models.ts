
export interface ItemSizeModel {
    id: number;
    size: string;
}

export interface ItemColorModel {
    id: number;
    color: string;
}

export interface AddressModel {
    id: number;
    street?: string;
    flatNumber?: string;
    postalCode?: string;
    city?: string;
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

export interface ComplaintModel {
    id: number;
    user: UserModel;
    order: OrderModel;
    createdDate: Date;
    complaintCategory: ComplaintCategoryModel;
    complaintStatus: ComplaintStatusModel;
}

export interface ComplaintCategoryModel {
    id: number;
    category: string;
}

export interface ComplaintStatusModel {
    id: number;
    status: string;
}

export interface OrderModel {
    id: number;
    user: UserModel;
    orderStatus: OrderStatusModel;
    createdDate: Date;
    lastModifiedDate: Date;
    address: AddressModel;
}

export interface OrderStatusModel {
    id: number;
    status: string;
}


