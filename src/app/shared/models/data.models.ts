export interface RegistrationModel {
  email: string;
  name: string;
  surname: string;
  password: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
