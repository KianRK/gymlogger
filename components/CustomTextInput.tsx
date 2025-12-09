import { TextInput, TextInputProps } from 'react-native';

import useThemeColors from '@/hooks/UseThemeColors';

interface CustomTextProps extends TextInputProps {
  children?: React.ReactNode;
  fontFamily?: string;
  ref?: React.RefObject<TextInput | null>;
}

const CustomTextInput = ({
  children,
  fontFamily,
  ref,
  style,
  ...otherProps
}: CustomTextProps) => {
  const colors = useThemeColors();

  return (
    <TextInput
      ref={ref}
      style={[
        {
          fontFamily: fontFamily ? fontFamily : 'Outfit-Regular',
          color: colors.text,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </TextInput>
  );
};

export default CustomTextInput;
