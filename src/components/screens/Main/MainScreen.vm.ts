import { inject, injectable } from 'inversify';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { ValueHolder } from '@/utils/ValueHolder';
import { IVMProps, Maybe } from '@/utils/types/typescript.types';
import * as api from '@/api';
import * as LambdaValue from '@/utils/LambdaValue';
import { IScreenMainProps, IScreenMainVM } from './ScreenMain.types';
import { TYPES } from '@/boot/IoC/types';

export interface IScreenMainVMProps extends IScreenMainProps, IVMProps {}

@injectable()
export class ScreenMainVM implements IScreenMainVM {
    @inject(TYPES.CartDataStore) public cartStore!: api.ICartDataStore;
    @inject(TYPES.CategoryDataStore) public categoryStore!: api.ICategoryDataStore;
    @observable private _isActive: boolean = false;
    private readonly _propsHolder = new ValueHolder<Maybe<IScreenMainVMProps>>(undefined);
    private _disposers: IReactionDisposer[] = [];

    constructor () {
      makeObservable(this);
    }

    @action.bound
    initialize (props: LambdaValue.LambdaValue<IScreenMainVMProps>) {
      this._propsHolder.setValue(props);

      const disposer = reaction(
        () => this._props?.isActive,
        (isActive) => {
          this._setActive(isActive).then();
        },
        { fireImmediately: true },
      );

      this._disposers.push(
        disposer,
      );

      return [
        disposer,
      ];
    }

    @computed
    public get categories () {
      return this.categoryStore.categories;
    }

    @computed
    public get isError () {
      return this.categoryStore.isError || this.cartStore.isError;
    }

    @computed
    public get isLoading () {
      return this.categoryStore.isLoading || this.cartStore.isLoading;
    }

    public onRefresh = () => {
      if (this.categoryStore.isError) {
        this.categoryStore.refresh().then();
      }
      if (this.cartStore.isError) {
        this.cartStore.refresh().then();
      }
    };

    dispose () {
      this._disposers.forEach(dispose => dispose());
      this._disposers = [];
    }

    @action.bound
    private async _refresh () {
      this.categoryStore.refresh().then();
      this.cartStore.refresh().then();
    }

    @action.bound
    private async _setActive (active: boolean = false) {
      if (this._isActive === active) { return; }

      this._isActive = active;
      if (active) {
        this._refresh().then();
      }
    }

    @computed
    private get _props () {
      return this._propsHolder.value;
    }
}
