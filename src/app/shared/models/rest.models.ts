export interface RegistrationRequest {
  email?: string;
  username?: string;
  name?: string;
  surname?: string;
  password?: string;
  street?: string;
  flatNumber?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
}

//TODO: mayube merge this stuff with RegistrationRequest
export interface AddAddressRequest {
  userId: number;
  street?: string;
  flatNumber?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  token: string;
  username: string;
  email: string;
  roles: string[];
  success: boolean;
  message: string;
}

export interface AddToCartRequest {
  itemId?: number;
  itemSizeId?: number;
  userId?: number;
  itemAmount?: number;
}
