import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRouter } from '@/AppRouter';
import { useAppState } from '@/hooks/useAppState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { observer } from 'mobx-react';
import { DebugVars } from '@/debug';
import { reactotronInit } from '@/debug/reactotron';
import { ModalProvider } from '@shared/ModalProvider';

export const RootComponent = observer((): React.JSX.Element => {
  const { isActive } = useAppState();
  const theme = useAppTheme();

  useEffect(() => {
    if (DebugVars?.enableReactotron) {
      reactotronInit();
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      theme.refresh().then();
    }
  }, [isActive]);


  return (
    <SafeAreaProvider style={{ backgroundColor: theme.color.bgBasic }}>
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </SafeAreaProvider>
  );
});
