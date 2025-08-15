import { IVMCore, IVMProps } from '@/utils/types/typescript.types';
import * as api from '@/api';

export interface IScreenSearchProps {
}

export interface IScreenSearchVM extends IVMCore {
    productDataStore: api.IProductDataStore
    categoryDataStore: api.ICategoryDataStore
}

export interface IScreenSearchVMProps extends IScreenSearchProps, IVMProps {}
