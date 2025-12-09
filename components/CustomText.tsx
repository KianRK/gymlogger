import { Text, TextProps } from 'react-native';

import useThemeColors from '@/hooks/UseThemeColors';

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
  const colors = useThemeColors();
  return (
    <Text
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
    </Text>
  );
};

export default CustomText;
