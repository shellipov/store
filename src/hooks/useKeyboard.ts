import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { KeyboardEvent } from 'react-native/Libraries/Components/Keyboard/Keyboard';

export function useKeyboard () {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const onKeyboardShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardVisible(true);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
}
