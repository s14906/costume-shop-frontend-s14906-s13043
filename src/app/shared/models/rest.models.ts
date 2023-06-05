import {
    AddressDTO,
    CartItemDTO,
    ComplaintChatMessageDTO,
    ComplaintDTO, ItemCategoryDTO,
    ItemDTO, ItemSetDTO, OrderDetailsDTO,
    OrderDTO,
    UserDTO
} from "./dto.models";
import {ItemSizeModel} from "./data.models";

export interface SimpleResponse {
    message: string;
    success: boolean;
}

export interface GetAddressesResponse extends SimpleResponse {
    addresses: AddressDTO[];
}

export interface CartResponse extends SimpleResponse {
    cartItems: CartItemDTO[]
}

export interface UserResponse extends SimpleResponse {
    user: UserDTO;
}

export interface ComplaintResponse extends SimpleResponse {
    complaintId: number;
    complaints: ComplaintDTO[];
}

export interface ItemResponse extends SimpleResponse {
    items: ItemDTO[];
    itemSizes: ItemSizeModel[];
    itemCategories: ItemCategoryDTO[];
    itemSets: ItemSetDTO[];
}

export interface OrderResponse extends SimpleResponse {
    orders: OrderDTO[];
    orderId: number;
}

export interface ComplaintChatMessageResponse extends SimpleResponse {
    complaintChatMessages: ComplaintChatMessageDTO[];
}

export interface OrderDetailsResponse extends SimpleResponse {
    orderDetails: OrderDetailsDTO;
}

export interface PaymentTransactionResponse extends SimpleResponse {
    paymentTransactionId: number;
}
