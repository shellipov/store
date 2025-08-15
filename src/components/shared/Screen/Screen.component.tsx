import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { DebugPanel } from '@/debug';
import { TextUI } from '../../ui/TextUI';
import { ButtonUI } from '../../ui/ButtonUI';
import { NavBar } from '../NavBar';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/AppPouter.types';
import { observer } from 'mobx-react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FlexProps } from '@/utils/PropsStyles';
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { useKeyboard } from '@/hooks/useKeyboard';

interface IScreenProps extends ViewProps, FlexProps {
    isError?: boolean;
    topColor?: ColorValue;
    onRefresh?: () => void;
}

export const Screen = observer((props: IScreenProps) => {
  const { children, isError, topColor, style, ...rest } = props;

  const route = useRoute();
  const theme = useAppTheme();
  const { isKeyboardVisible } = useKeyboard();

  const isMain = route.name === Routes.Main;
  const bgColor = { backgroundColor: theme.color.bgBasic };
  const statusBarColor = { backgroundColor: topColor || theme.color.bgBasic };

  // Динамический offset для Android, чтобы не было белого хвоста
  const keyboardVerticalOffset =
        Platform.OS === 'ios'
          ? 0
          : isKeyboardVisible
            ? 0 // клавиатура открыта — без отступа
            : StatusBar.currentHeight || 0; // клавиатура закрыта — учитываем статусбар

  if (isError) {
    return (
      <SafeAreaView style={[styles.screen, bgColor, style]} {...rest}>
        <DebugPanel />
        {!isMain && <NavBar title={'Ошибка'} />}
        <View style={styles.errorView}>
          <TextUI
            size={'bigTitle'}
            style={[styles.errorText, { color: theme.color.textRed }]}
            text={'Ошибка обновления\nданных'} />
          {!!props.onRefresh && (
            <ButtonUI
              title={'Обновить'}
              style={styles.button}
              type={'redBorder'}
              onPress={props.onRefresh} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <DebugPanel />

      {/* Верхняя зона */}
      <SafeAreaView style={[{ width: '100%' }, statusBarColor]}>
        <StatusBar backgroundColor={topColor || theme.color.bgBasic} />
      </SafeAreaView>

      <SafeAreaView style={[styles.screen, bgColor, style]} {...rest}>
        {children}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 60,
  },
});
