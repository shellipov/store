// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ButtonUI } from '../../ui/ButtonUI';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { CartBlockComponent } from '@shared/CartBlock';
import { Screen } from '@shared/Screen';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { Col } from '@shared/Col';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { Row } from '@shared/Row';
import { ImageUI } from '@components/ui/ImageUI';
import { TouchableOpacityUI } from '@components/ui/TouchableOpacityUI';
import { IScreenMainProps, IScreenMainVM } from './ScreenMain.types';
import { useAppState } from '@/hooks/useAppState';
import { CategoryEnum } from '@/api';
import { First } from '@shared/Firts';
import { Loader } from '@shared/Loader';
import { SearchBlockComponent } from '@shared/SearchBlock';
import { useModal } from '@shared/ModalProvider';
import { useFocusEffect } from '@react-navigation/native';

export const ScreenMain = observer((props: { route: { params: IScreenMainProps } }) => {
  const { isActive } = useAppState();
  const vm = useInjection<IScreenMainVM>(TYPES.ScreenMainVM);
  const navigation = useNavigationHook();
  const theme = useAppTheme();
  const { showModal, hideModal } = useModal();
  const color = theme.color;
  const onPressProfile = useCallback(() => navigation.navigate('Profile'), []);
  const onPressItem = useCallback((type: CategoryEnum) => navigation.navigate('Category', { category: type }), []);

  useEffect(() => {
    vm.initialize(() => ({ ...props.route.params, isActive }));

    return () => {
      vm.dispose();
    };
  }, [isActive]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('transitionEnd', () => {
        const random = Math.floor(Math.random() * 5) + 1;
        if (random === 1) {
          openAlert();
        }
      });

      return unsubscribe;
    }, [navigation]),
  );

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <TouchableOpacityUI
        flex height={130} radius={16} borderWidth={1} margin={6} padding={6} justifyContent={'space-between'}
        bg={color.bgBasic} borderColor={color.bgBasic} onPress={onPressItem} context={item.type}>
        <TextUI text={item.name} size={'medium'} mb={4} />
        <Col height={70} padding={2} radius={8} bg={color.bgTransparentImage}>
          <ImageUI src={item.image} resizeMode="contain" flex />
        </Col>
      </TouchableOpacityUI>
    );
  }, [color]);

  const openAlert = () => {
    showModal(
      <Col flex justifyContent={'space-between'} alignItems={'center'}>
        <TextUI size={'title'} alignItems={'center'} text={'Просто модалка что б\nвсех бесить'} style={{ textAlign: 'center' }} />
        <TextUI size={'medium'} alignItems={'center'} text={'Нужно просто закрыть и смириться'} style={{ textAlign: 'center' }} />
        <Row>
          <ButtonUI title="Закрыть" onPress={hideModal} />
        </Row>
      </Col>,
    );
  };

  return (
    <Screen isError={vm.isError} onRefresh={vm.onRefresh}>
      <Col flex>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
        <Row justifyContent={'flex-end'} ph={8}>
          <ButtonUI
            height={50} width={50} radius={16} ph={0} pv={0} justifyContent={'center'} alignItems={'center'}
            title={''} onPress={onPressProfile}>
            <Ionicons name={'user'} size={28} color={'black'} />
          </ButtonUI>
        </Row>
        <First>
          {vm.isLoading && (
            <Loader />
          )}
          <FlatListWithPagination
            data={vm.categories}
            renderItem={renderItem}
            header={renderListHeader}
            numColumns={3} />
        </First>
        <Col absolute left={16} bottom={16}>
          <SearchBlockComponent />
        </Col>
        <Col absolute right={16} bottom={16}>
          <CartBlockComponent />
        </Col>
      </Col>
    </Screen>
  );
});

const renderListHeader = () => {
  return (<Row height={64} />);
};
