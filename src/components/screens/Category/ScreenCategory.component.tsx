// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useNavigationHook } from '@/hooks/useNavigation';
import { CartBlockComponent } from '@shared/CartBlock';
import { NavBar } from '@shared/NavBar';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Screen } from '@shared/Screen';
import { createRefreshFunction, paginationData } from '@/helpers';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { TextUI } from '@components/ui/TextUI';
import { CategoryEnum, ICartDataStore, ICategoryDataStore, IProductDataStore } from '@/api';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { TouchableOpacityUI } from '@components/ui/TouchableOpacityUI';
import { ImageUI } from '@components/ui/ImageUI';
import { First } from '@shared/Firts';
import { Loader } from '@shared/Loader';

export interface IScreenCategoryProps {
    category: CategoryEnum
}

export const ScreenCategory = observer((props: { route: { params: IScreenCategoryProps }}) => {
  const category = props.route.params.category;
  const navigation = useNavigationHook();
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);
  const productStore = useInjection<IProductDataStore>(TYPES.ProductDataStore);
  const categoryStore = useInjection<ICategoryDataStore>(TYPES.CategoryDataStore);
  const data = productStore.getCategory(category);
  const formattedData = paginationData(data);
  const pageButtons = Object.keys(formattedData);
  const isPaginationVisible = pageButtons.length > 1;
  const theme = useAppTheme();
  const color = theme.color;
  const cartBlockBottom = isPaginationVisible ? 67 : 16;

  const onPressItem = useCallback((id: number)=> navigation.navigate('ProductCard', { id }), []);

  useEffect(() => {
    categoryStore.refresh().then();
    productStore.refresh().then();
  }, []);

  const onRefresh = createRefreshFunction([productStore, cartStore]);

  const renderProductItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacityUI
      flex height={130} radius={16} borderWidth={1} ma={8} pa={6} bg={color.bgBasic} borderColor={color.bgBasic}
      onPress={onPressItem} context={item.id}>
      <Row flex>
        <Col flex mr={16} bg={color.bgGray} radius={12}>
          <ImageUI flex radius={12} src={item.image} resizeMode="cover" />
        </Col>
        <Col flex={2}>
          <Row mv={6}>
            <TextUI text={item.name} size={'large'} numberOfLines={1} />
          </Row>
          <Row mv={4}>
            <TextUI text={item.description} size={'small'} numberOfLines={1} />
          </Row>
          <Row mv={4}>
            <TextUI text={item.price + ' ₽'} size={'medium'} style={{ color: color.textGreen }} />
          </Row>
          <Row mv={4} alignItems={'center'}>
            <Ionicons name={'star'} size={20} color={color.elementPrimary} />
            <TextUI text={` - ${item.productRating}`} size={'medium'} />
          </Row>
        </Col>
      </Row>
    </TouchableOpacityUI>
  ), [theme.theme]);

  return (
    <Screen isError={productStore.isError || cartStore.isError} onRefresh={onRefresh}>
      <NavBar title={categoryStore.getCategoryName(category)} />
      <First>
        {productStore.isLoading && (
          <Loader />
        )}
        <FlatListWithPagination data={data} renderItem={renderProductItem}>
          <Col absolute right={16} bottom={cartBlockBottom}>
            <CartBlockComponent />
          </Col>
        </FlatListWithPagination>
      </First>
    </Screen>
  );
});
