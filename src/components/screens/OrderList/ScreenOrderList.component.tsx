import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { Row } from '@shared/Row';
import { NavBar } from '@shared/NavBar';
import { Screen } from '@shared/Screen';
import { First } from '@shared/Firts';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { IOrderDataStore, IUserDataStore } from '@/api';
import { TYPES } from '@/boot/IoC/types';
import { Loader } from '@shared/Loader';
import { createRefreshFunction } from '@/helpers';

export interface IScreenOrderListProps {}

export const ScreenOrderList = observer((props: { route: { params: IScreenOrderListProps } }) => {
  const userStore = useInjection<IUserDataStore>(TYPES.UserDataStore);
  const user = userStore.model.data;
  const orderStore = useInjection<IOrderDataStore>(TYPES.OrderDataStore);
  const orders = orderStore.orders.filter(i => i.user.id === user?.id);
  const navigation = useNavigationHook();
  const theme = useAppTheme();

  useEffect(() => {
    orderStore.refresh().then();
  }, []);

  const isError = userStore.isError || orderStore.isError;

  const onRefresh = createRefreshFunction([userStore, orderStore]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: theme.color.bgAdditionalTwo }]} onPress={() => navigation.navigate('Order', { order: item })}>
      <View style={{ paddingBottom: 6 }}>
        <Row style={[styles.row]}>
          <TextUI size={'large'} text={`Заказ № ${item.id}`} style={{ color: theme.color.textGreen }} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'large'} text={'Время'} />
          <TextUI
            size={'medium'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.date}`} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'large'} text={'Кол-во товаров'} />
          <TextUI
            size={'medium'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.cart.reduce((acc: number, i: {numberOfProducts: number}) => acc + i.numberOfProducts, 0)} шт`} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'large'} text={'Стоимость'} />
          <TextUI
            size={'medium'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.totalSum || 0} ₽`} />
        </Row>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen isError={isError} onRefresh={onRefresh}>
      <NavBar title={'Заказы'} />
      <View style={{ flex: 1, paddingTop: 8, backgroundColor: theme.color.bgAdditional }}>
        <First>
          {orderStore.isLoading && (
            <Loader />
          )}
          {!orders?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}
          <FlatListWithPagination data={orders} renderItem={renderItem} />
        </First>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    paddingVertical: 4,
  },
});
