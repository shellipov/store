import { ApiStatusEnum } from '@/api/ApiTypes.types';

export enum CategoryEnum {
    clothesAndShoes= 'clothesAndShoes',
    householdGoods = 'householdGoods',
    electronics = 'electronics',
    householdAppliances = 'householdAppliances',
    goodsForChildren = 'goodsForChildren',
    constructionAndRenovation = 'constructionAndRenovation',
    furniture = 'furniture',
    pharmacy = 'pharmacy',
    hobbiesAndCreativity = 'hobbiesAndCreativity',
}

export interface ICategoryItem {
    id: number;
    type: CategoryEnum;
    name: string;
    image: string;
}

export interface IGetFakeCategoryResponse {
    data?: ICategoryItem[];
    status?: ApiStatusEnum;
    message?: string;
}
