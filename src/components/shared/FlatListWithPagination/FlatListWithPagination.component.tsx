import React, { useCallback, useMemo, useRef, useState } from 'react';
import {FlatList, FlatListProps, ListRenderItem, StyleSheet, View, ViewProps} from 'react-native';
import { FlatListVars } from '@/settings/FlatList.vars';
import { Chip } from '../Chip';
import { paginationData } from '@/helpers';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IListItem {
  id: string | number | undefined;
  [key: string]: any;
}

export type IListData = IListItem[] | null | undefined;
export type IRenderItem<T = IListItem> = ListRenderItem<T>;

export interface IFlatListWithPaginationProps extends ViewProps {
  data: IListData;
  withoutScroll?: boolean;
  numColumns?: number;
  header?: React.ComponentType<any> | React.ReactElement;
  renderItem: IRenderItem;
  children?: React.ReactNode;
}

export const FlatListWithPagination = React.memo(<T extends IListItem>({
  data = [],
  renderItem,
  header,
  withoutScroll,
  numColumns,
  children,
  ...viewProps
}: IFlatListWithPaginationProps) => {
  const flatListRef = useRef<FlatList<T>>(null);
  const theme = useAppTheme();

  // Мемоизация данных пагинации
  const { formattedData, pageButtons } = useMemo(() => {
    const formatted = paginationData(data!);

    return {
      formattedData: formatted,
      pageButtons: Object.keys(formatted),
    };
  }, [data]);

  const [selectedPage, setSelectedPage] = useState(1);
  const isPaginationVisible = pageButtons.length > 1;

  // Оптимизация рендера кнопок пагинации
  const renderPageButton = useCallback(({ item }: { item: string }) => {
    const handlePress = () => {
      setSelectedPage(+item);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    };

    return (
      <Chip
        style={styles.chip}
        isSelected={+item === selectedPage}
        onPress={handlePress}>
        <Chip.Text text={item} />
      </Chip>
    );
  }, [selectedPage]);

  // Мемоизация ключей элементов
  const keyExtractor = useCallback((item: T) => `item_${item?.id || item?.product?.id}`, []);

  // Мемоизация стилей
  const containerStyle = useMemo(() => [
    styles.contentContainer,
    { backgroundColor: theme.color.bgAdditional },
    viewProps.style,
  ], [theme.color.bgAdditional, viewProps.style]);

  return (
    <View style={containerStyle}>
      <FlatList<T>
        style={styles.list}
        ListHeaderComponent={header}
        ref={flatListRef}
        numColumns={numColumns}
        scrollEnabled={!withoutScroll}
        data={formattedData[selectedPage] as T[]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        {...FlatListVars} />

      {isPaginationVisible && (
        <FlatList
          data={pageButtons}
          renderItem={renderPageButton}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paginationContainer}
          {...FlatListVars} />
      )}

      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  list: {
    marginVertical: 8,
  },
  chip: {
    marginTop: 8,
    marginRight: 12,
    height: 40,
    alignSelf: 'flex-end',
  },
  paginationContainer: {
    paddingHorizontal: 16,
  },
});
