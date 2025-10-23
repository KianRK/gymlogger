import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  children?: React.ReactNode;
  fontFamily?: string;
}

const CustomText = ({
  children,
  fontFamily,
  style,
  ...otherProps
}: CustomTextProps) => {
  return (
    <Text
      style={[
        { fontFamily: fontFamily ? fontFamily : 'Outfit-Regular' },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
};

export default CustomText;
