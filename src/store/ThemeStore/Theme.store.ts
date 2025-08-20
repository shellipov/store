import { action, computed, makeObservable } from 'mobx';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeEnum, ThemeEnum, ThemeStorageTypeEnum } from './Theme.types';
import { errorService } from '@/api/ErrorDataStore/errorService';
import { ErrorTypeEnum } from '@/api';
import { ColorsVars } from '@/settings';
import { injectable } from 'inversify/lib/esm';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';

const THEME_LIST = {
  [AppThemeEnum.System]: 'Системная',
  [AppThemeEnum.Light]: 'Светлая',
  [AppThemeEnum.Black]: 'Темная',
};

const THEMES = Object.values(AppThemeEnum);

export interface IThemeStore {
  readonly appTheme: AppThemeEnum; // Выбранная тема в приложении (системная/светлая/темная)
  readonly deviceTheme: ThemeEnum | undefined; // Текущая тема устройства (светлая/темная)
  readonly theme: ThemeEnum; // Активная тема (светлая/темная) с учетом всех настроек
  readonly name: string;
  readonly color: {[key in keyof typeof ColorsVars]? : string};
  readonly isDark: boolean;
  readonly isError: boolean;
  changeTheme(): Promise<void>;
  refresh(): Promise<void>;
}

@injectable()
export class ThemeStore implements IThemeStore {
  private _appThemeHolder = new AsyncDataHolder<AppThemeEnum>();
  private _deviceThemeHolder = new AsyncDataHolder<ThemeEnum>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get appTheme () {
    return this._appThemeHolder.data || AppThemeEnum.Light;
  }

  @computed
  public get deviceTheme () {
    return this._deviceThemeHolder.data;
  }

  @computed
  public get name (): string {
    return THEME_LIST[this.appTheme];
  }

  @computed
  public get theme (): ThemeEnum {
    if (this.appTheme === AppThemeEnum.System) {
      return this.deviceTheme || ThemeEnum.Light;
    }

    return this.appTheme === AppThemeEnum.Light ? ThemeEnum.Light : ThemeEnum.Black;
  }

  @computed
  public get isDark () {
    return this.theme === ThemeEnum.Black;
  }

  @computed
  public get isLight () {
    return this.theme === ThemeEnum.Light;
  }

  @computed
  public get isError () {
    return this._appThemeHolder.isError || this._deviceThemeHolder.isError;
  }

  @computed
  public get color () {
    const index = this.isDark ? 1 : 0;

    return {
      black: ColorsVars.black,
      white: ColorsVars.white,
      violet: ColorsVars.violet,
      transparent: ColorsVars.transparent,
      disabledText: ColorsVars.disabledText,
      gray: ColorsVars.gray,
      red: ColorsVars.red,
      modalBackground: ColorsVars.modalBackground,
      elementPrimary: ColorsVars.elementPrimary[index],
      secondaryPrimary: ColorsVars.secondaryPrimary[index],
      elementDisabled: ColorsVars.elementDisabled[index],
      elementDanger: ColorsVars.elementDanger[index],
      elementGreen: ColorsVars.elementGreen[index],
      bgBasic: ColorsVars.bgBasic[index],
      bgAdditional: ColorsVars.bgAdditional[index],
      bgAdditionalTwo: ColorsVars.bgAdditionalTwo[index],
      bgGray: ColorsVars.bgGray[index],
      bgTransparentImage: ColorsVars.bgTransparentImage[index],
      textPrimary: ColorsVars.textPrimary[index],
      textWhite: ColorsVars.textWhite[index],
      disabledPrimary: ColorsVars.disabledPrimary[index],
      textGreen: ColorsVars.textGreen[index],
      textRed: ColorsVars.textRed[index],
      textOrange: ColorsVars.textOrange[index],
      textGray: ColorsVars.textGray[index],
      textViolet: ColorsVars.textViolet[index],
      basicInversion: ColorsVars.basicInversion[index],
      borderColor: ColorsVars.borderColor[index],
    };
  }

  @action.bound
  public async changeTheme (): Promise<void> {
    try {
      const currentIndex = THEMES.indexOf(this.appTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      const newTheme = THEMES[nextIndex];

      await AsyncStorage.setItem(ThemeStorageTypeEnum.Theme, newTheme);
      this._appThemeHolder.setData(newTheme);

      await this.refresh();
    } catch (error: any) {
      this._appThemeHolder.setError({ name: 'Системная ошибка', message: 'Попробуйте еще раз' });
      await errorService({
        type: ErrorTypeEnum.LoadData,
        error,
        withoutAlerts: true,
      });
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      const deviceTheme = Appearance.getColorScheme();
      this._deviceThemeHolder.setData(deviceTheme === 'dark' ? ThemeEnum.Black : ThemeEnum.Light);

      const savedTheme = await AsyncStorage.getItem(ThemeStorageTypeEnum.Theme) as AppThemeEnum | null;
      this._appThemeHolder.setData(savedTheme || (deviceTheme ? AppThemeEnum.System : AppThemeEnum.Light));

      if (!savedTheme) {
        const defaultTheme = deviceTheme ? AppThemeEnum.System : AppThemeEnum.Light;
        await AsyncStorage.setItem(ThemeStorageTypeEnum.Theme, defaultTheme);
      }
    } catch (error: any) {
      this._appThemeHolder.setError({ name: 'Системная ошибка', message: 'Попробуйте еще раз' });
      await errorService({
        type: ErrorTypeEnum.LoadData,
        error,
        withoutAlerts: true,
      });
    }
  }
}
