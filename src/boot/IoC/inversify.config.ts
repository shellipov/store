import { Container } from 'inversify';
import { TYPES } from './types';
import { IThemeStore, ThemeStore } from '@/store';
import {
  CartDataStore,
  CategoryDataStore,
  ErrorDataStore,
  EventDataStore,
  ICartDataStore,
  ICategoryDataStore,
  IErrorDataStore,
  IEventDataStore,
  IOrderDataStore,
  IProductDataStore,
  IUserDataStore,
  OrderDataStore,
  ProductDataStore,
  UserDataStore,
} from '@/api';
import { ScreenMainVM } from '@components/screens/Main/MainScreen.vm';
import { IScreenMainVM } from '@components/screens/Main';
import { ScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.vm';
import { IScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.types';
import { ScreenCreateOrderVM } from '@components/screens/CreateOrder/ScreenCreateOrder.vm';
import { IScreenCreateOrderVM } from '@components/screens/CreateOrder';

const container = new Container();
// system stores
container.bind<IThemeStore>(TYPES.ThemeStore).to(ThemeStore).inSingletonScope();
// data stores
container.bind<IUserDataStore>(TYPES.UserDataStore).to(UserDataStore).inSingletonScope();
container.bind<ICartDataStore>(TYPES.CartDataStore).to(CartDataStore).inSingletonScope();
container.bind<IErrorDataStore>(TYPES.ErrorDataStore).to(ErrorDataStore);
container.bind<IEventDataStore>(TYPES.EventDataStore).to(EventDataStore);
container.bind<IOrderDataStore>(TYPES.OrderDataStore).to(OrderDataStore);
container.bind<IProductDataStore>(TYPES.ProductDataStore).to(ProductDataStore);
container.bind<ICategoryDataStore>(TYPES.CategoryDataStore).to(CategoryDataStore);
// view models
container.bind<IScreenMainVM>(TYPES.ScreenMainVM).to(ScreenMainVM);
container.bind<IScreenErrorsVM>(TYPES.ScreenErrorsVM).to(ScreenErrorsVM);
container.bind<IScreenCreateOrderVM>(TYPES.ScreenCreateOrderVM).to(ScreenCreateOrderVM);

export { container };


