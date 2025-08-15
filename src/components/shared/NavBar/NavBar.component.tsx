import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Row } from '../Row';
import { ButtonUI, IButtonUIProps } from '../../ui/ButtonUI';
import { ITextUIProps, TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { FlexProps } from '@/utils/PropsStyles';
import { useCompoundProps } from '@/utils/CompoundUtils';
import { observer } from 'mobx-react';
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';

export interface INavBarProps extends FlexProps {
  title?: string;
    topColor?: ColorValue;
    children?: React.ReactNode;
}

export const _NavBar = (props: INavBarProps) => {
  const navigation = useNavigationHook();
  const { title, ...rest } = props;

  const onPress = useCallback(()=> {
    navigation.goBack();
  }, []);

  const innerProps = useCompoundProps(props, _NavBar, 'Button', 'Text');

  return (
    <>
      <Row style={styles.navBar} {...rest}>
        <ButtonUI title={'Назад'} style={styles.button} onPress={onPress} {...innerProps.button} />
        <TextUI size={'title'} text={title} {...innerProps.text} />
      </Row>
    </>
  );
};

const styles = StyleSheet.create({
  navBar: { paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center' },
  button: { height: 40, borderRadius: 20, alignSelf: 'flex-start' },
});

_NavBar.Button = (props: IButtonUIProps) => null;
_NavBar.Text = (props: ITextUIProps) => null;

export const NavBar = observer(_NavBar);

