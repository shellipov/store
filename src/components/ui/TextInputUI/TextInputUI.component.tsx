import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useNavigationHook } from '@/hooks/useNavigation';
import { FlexProps } from '@/utils/PropsStyles';

type TextSize = 'small' | 'medium' | 'large';

export interface ITextInputUIProps extends TextInputProps, FlexProps{
    textSize: TextSize;
    isError?: boolean;
    children?: React.ReactNode;
}

const TEXT_SIZE = {
  small : {
    fontSize: 16,
    lineHeight: 20,
  },
  medium : {
    fontSize: 18,
    lineHeight: 22,
  },
  large : {
    fontSize: 24,
    lineHeight: 28,
  },
};

export function TextInputUI (props: ITextInputUIProps) {
  const { children, textSize, isError, style, autoFocus, ...rest } = props;
  const theme = useAppTheme();
  const navigation = useNavigationHook();
  const { color } = theme;
  const borderColor = isError ? color.elementDanger : color.secondaryPrimary;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!autoFocus) { return undefined; }
    const unsubscribe = navigation.addListener('transitionEnd', () => {
      // Фокусируем только после окончания анимации перехода
      inputRef.current?.focus();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <TextInput
      ref={inputRef}
      cursorColor={color.textPrimary}
      style={[
        styles.textInput,
        { color: color.textPrimary, borderColor, backgroundColor: color.bgBasic },
        TEXT_SIZE[textSize],
        style]} {...rest}>
      {children}
    </TextInput>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
    width: 250,
    minHeight: 38,
  },
});
