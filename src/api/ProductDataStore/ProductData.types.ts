import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { CategoryEnum } from '@/api/CategoryDataStore';


export interface IProduct {
    id: number;
    name: string;
    description: string
    category: CategoryEnum | string
    price: number;
    quantityOfGoods: number
    productRating: number
    image: string
}

export interface ISimplifiedProduct extends Pick<IProduct, 'id' | 'name' | 'price'> {}

export type ProductListType = {
    category: CategoryEnum | string,
    products: IProduct[]
    }[]

export interface IGetFakeProductResponse {
    data?: ProductListType;
    status?: ApiStatusEnum;
    message?: string;
}
