import { ErrorTypeEnum } from '@/api';
import { action, computed, makeObservable } from 'mobx';
import { errorService } from '../ErrorDataStore/errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { getDataWithRandomDelay } from '@/helpers/getDataWithRandomDelay.helper';
import { CategoryEnum, ICategoryItem, IGetFakeCategoryResponse } from '@/api/CategoryDataStore/CategoryData.types';
import { categoryItems } from './CategoryData.data';

export interface ICategoryDataStore {
  readonly isError: boolean;
  readonly isLoading: boolean;
  readonly categories: ICategoryItem[]
  getCategoryName(type?: CategoryEnum | string) : string
  refresh(): Promise<void>;
}

@injectable()
export class CategoryDataStore implements ICategoryDataStore {
  private _holder = new AsyncDataHolder<IGetFakeCategoryResponse>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get categories () {
    return this._holder.data?.data || [];
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @computed
  public get isLoading () {
    return this._holder.isLoading;
  }

  public getCategoryName (type?: CategoryEnum) : string {
    return this.categories.find(i => i.type === type)?.name || '';
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      this._holder.setLoading();
      await suddenError('CategoryDataStore: refresh');
      const mockData = await getDataWithRandomDelay(categoryItems);
      this._holder.setData({
        data: mockData,
        status: ApiStatusEnum.Success,
      });
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}
