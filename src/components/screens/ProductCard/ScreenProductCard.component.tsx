// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import { observer } from 'mobx-react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { First } from '@shared/Firts';
import { CartBlockComponent } from '@shared/CartBlock';
import { NavBar } from '@shared/NavBar';
import { Screen } from '@shared/Screen';
import { createRefreshFunction, eventCreator } from '@/helpers';
import { ICartDataStore, IEventDataStore, IProductDataStore, IUserDataStore } from '@/api';
import { EventTypeEnum, ISimplifiedEventData } from '@/api/EventDataStore';
import { TextUI } from '@components/ui/TextUI';
import { ButtonUI } from '@components/ui/ButtonUI';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { Loader } from '@shared/Loader';

export interface IScreenProductCardProps {
    id: number;
}

export const ScreenProductCard = observer((props: { route: { params: IScreenProductCardProps }}) => {
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);
  const eventStore = useInjection<IEventDataStore>(TYPES.EventDataStore);
  const userStore = useInjection<IUserDataStore>(TYPES.UserDataStore);
  const productStore = useInjection<IProductDataStore>(TYPES.ProductDataStore);
  const id = props.route.params.id;
  const item = productStore.getProduct(id);
  const isInCart = cartStore.model.isInCart(item);
  const totalCount = cartStore.model.totalCount(item);
  const theme = useAppTheme();

  const isError = cartStore.isError || eventStore.isError || userStore.isError || productStore.isError;

  const onRefresh = createRefreshFunction([
    cartStore,
    eventStore,
    userStore,
    productStore,
  ]);

  useEffect(() => {
    productStore.refresh().then();
  }, []);

  const getEventData = () => ({
    user: userStore.model.simplifiedUser,
    product: productStore.getSimplifiedProduct(id),
    cartInfo: cartStore.model.cartInfo,
  }) as ISimplifiedEventData;

  const onAddToCart = useCallback(async ()=>{
    if (!!item) {
      await cartStore.addToCart(item);
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.AddToCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.model.data?.length]);

  const onDeleteFromCart = useCallback(async ()=> {
    if (!!item) {
      await cartStore.deleteFromCart(item).then();
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.DeleteFromCart });
      if (!!newEvent) {
        eventStore.addEvent(newEvent).then();
      }
    }
  }, [item, cartStore.model.data?.length]);

  return (
    <Screen isError={isError} onRefresh={onRefresh}>
      <NavBar title={'Карточка товара'} />
      <First>
        {!item && (
          <Loader />
        )}
        <ScrollView style={{ backgroundColor: theme.color.bgAdditional }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={ [styles.imageView, { backgroundColor: theme.color.bgGray }]}>
              <Image src={item?.image} resizeMode="cover" style={styles.image} />
            </View>
            <View style={{ flex: 2, flexDirection: 'column', paddingHorizontal: 24 }}>
              <View style={{ marginVertical: 8 }}>
                <TextUI text={item?.name} size={'title'} numberOfLines={1} />
              </View>
              <View style={{ marginVertical: 6 }}>
                <TextUI text={item?.description} size={'large'} numberOfLines={1} />
              </View>
              <View style={{ marginVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={'star'} size={24} color={theme.color.elementPrimary} />
                <TextUI text={` - ${item?.productRating}`} size={'medium'} />
              </View>
              <View style={{ marginVertical: 6 }}>
                <TextUI text={item?.price + ' ₽'} size={'title'} style={{ color:theme.color.textGreen }} />
              </View>
              <View style={{ marginVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                <TextUI text={`осталось ${item?.quantityOfGoods} шт.`} size={'medium'} />
              </View>
            </View>
          </View>
        </ScrollView>
      </First>
      <View style={styles.bottomBlock}>
        {/* TODO: пока не работает */}
        <ButtonUI title={'в избранное'} style={{ width: '48%' }} disabled={true} />
        <View style={{ width: '48%' }}>
          <First>
            {isInCart && (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <ButtonUI title={'-'} style={{ flex: 1 }} onPress={onDeleteFromCart} disabled={cartStore.isLoading} />
                <TextUI text={`${totalCount}`} size={'title'} style={{ marginHorizontal: 16 }} />
                <ButtonUI title={'+'} style={{ flex: 1 }} onPress={onAddToCart} disabled={cartStore.isLoading} />
              </View>
            )}
            <ButtonUI title={'в корзину'} style={{ width: '100%' }} onPress={onAddToCart} disabled={cartStore.isLoading} />
          </First>
        </View>
      </View>
      <View style={{ position: 'absolute', right: 16, bottom: 124 }}>
        <CartBlockComponent />
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    height: 350,
  },
  image: {
    flex: 1,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bottomBlock: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
});
