import { Text as DefaultText, View as DefaultView } from 'react-native';
import Colors from '@/constants/Colors';

type ThemeProps = {
  color?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { color?: string },
  colorName: keyof typeof Colors
) {
  const colorFromProps = props.color;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorName];
  }
}

export function Text(props: TextProps) {
  const { style, color: customColor, ...otherProps } = props;
  const color = useThemeColor({ color: customColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, color: customColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ color: customColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
