import {
  AddressDTO,
  CartItemDTO,
  ComplaintChatMessageDTO,
  ComplaintDTO,
  ItemWithImageDTO, OrderDetailsDTO,
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
  itemsWithImages: ItemWithImageDTO[];
  itemSizes: ItemSizeModel[];
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
