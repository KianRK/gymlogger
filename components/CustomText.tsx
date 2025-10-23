import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

const CustomText = ({ children, style, ...otherProps }: CustomTextProps) => {
  return (
    <Text
      style={[{ fontFamily: 'Outfit-VariableFont_wght' }, style]}
      {...otherProps}
    >
      {children}
    </Text>
  );
};

export default CustomText;
