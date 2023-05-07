export interface RegistrationModel {
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

export interface LoginModel {
  email: string;
  password: string;
}

export interface ItemModel {
  id: number;
  idCategory: number
  idItemSet: number;
  title: string;
  description: string;
  price: number;
  itemImages: ItemImageModel[];
  imageUrl: string;
}

export interface ItemImageModel {
  id: number;
  itemId: number;
  imageBase64: string;
}

export interface ItemSizeModel {
  id: number;
  size: string;
}

export interface ItemColorModel {
  id: number;
  color: string;
}
