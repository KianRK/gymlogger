import { TextInput, TextInputProps } from 'react-native';

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
  return (
    <TextInput
      ref={ref}
      style={[
        { fontFamily: fontFamily ? fontFamily : 'Outfit-Regular' },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </TextInput>
  );
};

export default CustomTextInput;
