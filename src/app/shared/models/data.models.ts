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

export interface ItemCartModel {
  item: ItemModel;
  itemSize: ItemSizeModel;
  itemCount: number;
}
