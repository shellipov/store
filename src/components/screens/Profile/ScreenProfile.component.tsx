import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigationHook } from '@/hooks/useNavigation';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Screen } from '@shared/Screen';
import { phoneFormatter } from '@/helpers/phoneFormatter';
import { ICartDataStore, IUserDataStore } from '@/api';
import { ButtonUI } from '@components/ui/ButtonUI';
import { TextUI } from '@components/ui/TextUI';
import { TextInputUI } from '@components/ui/TextInputUI';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { createRefreshFunction } from '@/helpers';

export interface IScreenProfileProps {}

export const ScreenProfile = observer((props: { route: { params: IScreenProfileProps }}) => {
  const userStore = useInjection<IUserDataStore>(TYPES.UserDataStore);
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);
  const navigation = useNavigationHook();
  const theme = useAppTheme();

  const [name, setName] = useState(userStore.model.data?.name);
  const [phone, setPhone] = useState(userStore.model.data?.phone);
  const [address, setAddress] = useState(userStore.model.data?.address);
  const isValidPhone = useMemo(() => phoneFormatter(phone).isValid, [phone]);
  const themeButtonStyle = {
    backgroundColor: theme.color.bgBasic,
    marginVertical: 0,
    marginBottom: 12,
    marginTop: 4,
  };

  useEffect(() => {
    userStore.updateAuthUserFields({ name, phone, address }).then();
  }, [name, phone, address]);

  const onChangeName = useCallback((text: string) => {
    setName(text);
  }, [name]);
  const onChangePhone = useCallback((text: string) => {
    const { formattedValue } = phoneFormatter(text);
    setPhone(formattedValue);
  }, [name]);
  const onChangeAddress = useCallback((text: string) => {
    setAddress(text);
  }, [name]);

  const onRefresh = createRefreshFunction([userStore, cartStore]);

  const logout = useCallback(()=> {
    Alert.alert(
      'Выйти из приложения?',
      'Ваша корзина удалится',
      [
        { text: 'Да', onPress: async () => {
          await userStore.logout();
          if (!userStore.model.data) {
            cartStore.deleteCart().then();
          }
        } },
        { text: 'Нет' },
      ]);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen isError={userStore.isError || cartStore.isError} onRefresh={onRefresh}>

        <View style={[{ paddingHorizontal: 16 }]}>
          <Row style={{ justifyContent: 'space-between' }}>
            <ButtonUI title={'Назад'} style={{ height: 40, borderRadius: 20 }} onPress={navigation.goBack} />
            <ButtonUI title={'Выйти'} type={'red'} onPress={logout} />
          </Row>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextUI size={'bigTitle'} text={'Профиль'} style={{ paddingVertical: 35 }} />
        </View>

        <ScrollView style={{ backgroundColor: theme.color.bgAdditionalTwo }}>
          <View style={styles.userDataBlock}>
            <Row style={styles.row}>
              <Col>
                <TextUI size={'large'} text={'Имя'} />
                <TextInputUI
                  value={name}
                  isError={!name}
                  textSize={'medium'}
                  style={styles.inputCenter}
                  onChangeText={onChangeName} />
              </Col>
            </Row>
            <Row style={styles.row}>
              <Col>
                <TextUI size={'large'} text={'Телефон'} />
                <TextInputUI
                  textSize={'medium'}
                  keyboardType={'numeric'}
                  style={styles.inputCenter}
                  value={phone}
                  isError={!isValidPhone }
                  maxLength={18}
                  onChangeText={onChangePhone} />
              </Col>
            </Row>
            <Row style={styles.row}>
              <Col>
                <TextUI size={'large'} text={'Адрес'} />
                <TextInputUI
                  value={address}
                  isError={!address}
                  textSize={'small'}
                  style={[styles.inputCenter, { minHeight: 50 }]}
                  onChangeText={onChangeAddress} multiline={true} />
              </Col>
            </Row>
          </View>

          <View>
            <Col style={styles.buttonBlock}>
              <TextUI size={'medium'} text={'Тема'} />
              <ButtonUI
                title={theme.name}
                type={'white'}
                style={[styles.button, themeButtonStyle]}
                onPress={theme.changeTheme} />
              <ButtonUI
                title={'Заказы'}
                type={'white'}
                style={styles.button}
                onPress={() => navigation.navigate('OrderList')} />
              <ButtonUI
                title={'Статистика'}
                type={'white'}
                style={styles.button}
                onPress={() => navigation.navigate('Statistics')} />
              <ButtonUI
                title={'Bugs'}
                type={'redBorder'}
                style={styles.button}
                onPress={() => navigation.navigate('Errors')} />
            </Col>
          </View>
        </ScrollView>

      </Screen>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  userDataBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  row: {
    paddingVertical: 4,
  },
  inputCenter: {
    textAlign: 'center',
  },
  buttonBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    width: '35%',
  },
});
