import { ErrorTypeEnum, IGetFakeProductResponse, IProduct, ISimplifiedProduct, ProductListType } from '@/api';
import { productList } from './ProductData.data';
import { action, computed, makeObservable } from 'mobx';
import { errorService } from '../ErrorDataStore/errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { getDataWithRandomDelay } from '@/helpers/getDataWithRandomDelay.helper';
import { CategoryEnum } from '@/api/CategoryDataStore';

export interface IProductDataStore {
  readonly isError: boolean;
  readonly isLoading: boolean;
  readonly products: ProductListType | undefined;
  getCategory(category: CategoryEnum) : (IProduct | never)[]
  getProduct(id: number) : IProduct | undefined
  getSimplifiedProduct(id: number) : ISimplifiedProduct | undefined
  refresh(): Promise<void>;
}

@injectable()
export class ProductDataStore implements IProductDataStore {
  private _holder = new AsyncDataHolder<IGetFakeProductResponse>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get products () {
    return this._holder.data?.data;
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @computed
  public get isLoading () {
    return this._holder.isLoading;
  }

  public getCategory (category: CategoryEnum) : (IProduct | never)[] {
    return this.products?.find(i => i.category === category)?.products || [];
  }

  public getProduct (id: number) : IProduct | undefined {
    return this.products?.map(i => i.products).flat().find(product => product.id === id);
  }

  public getSimplifiedProduct (id: number) : ISimplifiedProduct | undefined {
    const item = this.products?.map(i => i.products).flat().find(product => product.id === id);

    return !!item ? {
      id: item?.id,
      name: item?.name,
      price: item?.price,
    } : undefined;
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      this._holder.setLoading();
      await suddenError('ProductDataStore: refresh');
      const data = await getDataWithRandomDelay(productList);
      this._holder.setData({
        data,
        status: ApiStatusEnum.Success,
      });
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}
