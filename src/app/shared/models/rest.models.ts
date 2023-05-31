import {AddressDTO, CartItemDTO, UserDTO} from "./dto.models";

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
}
