import { inject, injectable } from 'inversify';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { ValueHolder } from '@/utils/ValueHolder';
import { IVMProps, Maybe } from '@/utils/types/typescript.types';
import * as api from '@/api';
import * as LambdaValue from '@/utils/LambdaValue';
import { IScreenErrorsProps, IScreenErrorsVM } from './ScreenErrors.types';
import { TYPES } from '@/boot/IoC/types';

export interface IScreenErrorsVMProps extends IScreenErrorsProps, IVMProps {}

@injectable()
export class ScreenErrorsVM implements IScreenErrorsVM {
  @inject(TYPES.ErrorDataStore) public errorDataStore!: api.IErrorDataStore;
  @observable private _isActive: boolean = false;
  private readonly _propsHolder = new ValueHolder<Maybe<IScreenErrorsVMProps>>(undefined);
  private _disposers: IReactionDisposer[] = [];

  constructor () {
    makeObservable(this);
  }

  @action.bound
  initialize (props: LambdaValue.LambdaValue<IScreenErrorsVMProps>) {
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

  dispose () {
    this._disposers.forEach(dispose => dispose());
    this._disposers = [];
    this.errorDataStore.dispose();
  }

  @action.bound
  private async _refresh () {
    this.errorDataStore.refresh().then();
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
