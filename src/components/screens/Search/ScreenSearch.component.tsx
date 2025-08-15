import { Keyboard, ListRenderItemInfo, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { Row } from '@shared/Row';
import { NavBar } from '@shared/NavBar';
import { Screen } from '@shared/Screen';
import { First } from '@shared/Firts';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { IScreenSearchProps, IScreenSearchVM } from './ScreenSearch.types';
import { useAppState } from '@/hooks/useAppState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Loader } from '@shared/Loader';
import { TextInputUI } from '@components/ui/TextInputUI';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { IProduct, ProductWithIdType } from '@/api';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { TouchableOpacityUI } from '@components/ui/TouchableOpacityUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { Col } from '@shared/Col';
import { createRefreshFunction } from '@/helpers';
import { DesiredRow } from '@shared/DesiredRow/DesiredRow.component';

export const ScreenSearchComponent = observer((props: { route: { params: IScreenSearchProps } }) => {
  const { isActive } = useAppState();
  const vm = useInjection<IScreenSearchVM>(TYPES.ScreenSearchVM);
  const theme = useAppTheme();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState<ProductWithIdType[] | undefined>(undefined);
  const navigation = useNavigationHook();

  const { debouncedFn, isPendingRef } = useDebouncedCallback((value: string) => {
    const data = vm.productDataStore.searchProduct(value);
    const formattedData = data?.map((el, i) => { return { id: i, data: el };});
    setDebouncedValue(formattedData);
  }, 1000);
  const noResults = !!searchValue && !debouncedValue?.length;
  const hideKeyboard = () => Keyboard.dismiss();

  const onChangeText = useCallback((value: string) => {
    setSearchValue(value);
    debouncedFn(value);
  }, [searchValue]) ;

  useEffect(() => {
    vm.initialize(() => ({ ...props.route.params, isActive }));

    return () => {
      vm.dispose();
    };
  }, [isActive]);

  const keyboardDismiss = useCallback(()=> Keyboard.dismiss(), [Keyboard]);
  const onPressItem = useCallback((id: number)=> navigation.navigate('ProductCard', { id }), [debouncedValue]);
  const onRefresh = createRefreshFunction([vm.productDataStore, vm.categoryDataStore]);
  const isError = vm.productDataStore?.isError || vm.categoryDataStore.isError;


  const renderProductItem = useCallback(({ item }: ListRenderItemInfo<ProductWithIdType>) => {
    return (
      <View key={`productItem_${item.id}`} style={[styles.item, { backgroundColor: theme.color.bgAdditionalTwo }]}>
        <Row pv={4}>
          <TextUI size={'large'} text={vm.categoryDataStore.getCategoryName(item?.data?.category)} style={{ color: theme.color.textPrimary }} />
        </Row>
        {item?.data?.products.map((product: IProduct) => (
          <TouchableOpacityUI key={product.id} pv={4} onPress={onPressItem} context={product.id}>
            <DesiredRow value={product.name} searchValue={searchValue} />
          </TouchableOpacityUI>
        ))
        }
      </View>
    );
  }, [debouncedValue]);

  return (
    <Screen isError={isError} onRefresh={onRefresh} topColor={theme.color.elementGreen}>
      <NavBar bg={theme.color.elementGreen} mb={0}>
        <NavBar.Text text={'Поиск'} style={[{ color: theme.color.textWhite }]} />
      </NavBar>
      <Col flex>
        <First>
          {vm.productDataStore.isLoading && (
            <Loader />
          )}
          <Col flex>
            <Col bg={theme.color.elementGreen} ph={16} pv={8}>
              <TextInputUI
                autoFocus
                borderColor={theme.color.elementGreen}
                width
                paddingHorizontal={12}
                height={45}
                value={searchValue}
                isError={false}
                textSize={'medium'}
                onChangeText={onChangeText} />
            </Col>
            <TouchableOpacityUI flex onPress={keyboardDismiss}>
              <First>
                {isPendingRef.current && (
                  <Col flex justifyContent={'center'} alignItems={'center'}>
                    <Loader />
                  </Col>
                )}
                {noResults && (
                  <Col flex justifyContent={'center'} alignItems={'center'}>
                    <TextUI size={'large'} text={'Ничего не найдено'} />
                  </Col>
                )}
                {debouncedValue?.length && (
                  <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
                    <FlatListWithPagination
                      data={debouncedValue}
                      renderItem={renderProductItem}
                      key={`key_${theme.isDark}`} />
                  </TouchableWithoutFeedback>

                )}
                <Col flex justifyContent={'center'} alignItems={'center'}>
                  <TextUI size={'large'} text={'Введите слово'} />
                </Col>
              </First>
            </TouchableOpacityUI>
          </Col>
        </First>
      </Col>
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
    paddingBottom: 6,
  },
});
