// @ts-ignore
import Ionicons from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigationHook } from '@/hooks/useNavigation';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { ICartDataStore } from '@/api';
import { TYPES } from '@/boot/IoC/types';

export const SearchBlockComponent = observer(()=> {
  const navigation = useNavigationHook();
  const theme = useAppTheme();
  const cartStore = useInjection<ICartDataStore>(TYPES.CartDataStore);

  useEffect(() => {
    if (cartStore.isEmpty) {
      cartStore.refresh().then();
    }
  }, [cartStore.isEmpty]);

  const backgroundColor = { backgroundColor: theme.color.elementGreen };

  return (
    <TouchableOpacity
      style={[styles.cartBlock, backgroundColor]} onPress={()=> navigation.navigate('Search')}>
      <Ionicons name={'search1'} size={36} color={theme.color.white} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cartBlock: {
    height: 88,
    width: 88,
    borderRadius: 44,
    borderBottomLeftRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    alignSelf: 'flex-start',
  },
});
