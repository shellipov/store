import { Row } from '@shared/Row';
import { TextUI } from '@components/ui/TextUI';
import React from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface DesiredRowProps {
  value: string
  searchValue: string
}

export const DesiredRow = ({ value, searchValue }: DesiredRowProps) => {
  const theme = useAppTheme();
  const startIndex = value.toLowerCase().indexOf(searchValue.toLowerCase());
  const endIndex = startIndex + searchValue.length;
  const wordBeginning = value.slice(0, startIndex);
  const middleOfWord = value.slice(startIndex, endIndex);
  const wordEnding = value.slice(endIndex, value.length);

  return (
    <Row pl={8}>
      { wordBeginning && (
        <TextUI text={wordBeginning} size={'medium'} numberOfLines={1} />
      )}
      <TextUI text={middleOfWord} size={'medium'} numberOfLines={1} style={{ color: theme.color.textOrange }} />
      <TextUI text={wordEnding} size={'medium'} numberOfLines={1} />
    </Row>
  );
};
