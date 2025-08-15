import { Animated, FlexAlignType, FlexStyle, StyleSheet, ViewStyle } from 'react-native';
import { shadowStyle } from '@/helpers/shadowStyle.helper';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

// Constants
const DEFAULT_TRUE_VALUE = 1;
const ZERO = 0;
const HIDDEN = 'hidden';
const VISIBLE = 'visible';

// Type definitions
export interface StyleProps extends FlexProps {
  style?: StyleProp<ViewStyle>;
}

interface ColorProps {
  bg?: string;
  opacity?: number | string | Animated.AnimatedNode;
}

interface PositionProps {
  absolute?: boolean;
  relative?: boolean;
  absoluteFill?: boolean;
  zIndex?: number;
}

export type FlexWrapType = 'wrap' | 'nowrap' | 'wrap-reverse';

interface FlexDirectionProps {
  row?: boolean;
  col?: boolean;
  reverse?: boolean;
  wrap?: FlexWrapType | boolean;
}

export type NumericSpacesType = 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 36 | 38 | 40 | 44 | 46 | 48 | 64;
export type SpacesType = NumericSpacesType;

interface PaddingGridProps {
  pl?: SpacesType;
  pr?: SpacesType;
  pt?: SpacesType;
  pb?: SpacesType;
  pv?: SpacesType;
  ph?: SpacesType;
  pa?: SpacesType;
}

interface MarginGridProps {
  ml?: SpacesType;
  mr?: SpacesType;
  mt?: SpacesType;
  mb?: SpacesType;
  mv?: SpacesType;
  mh?: SpacesType;
  ma?: SpacesType;
}

interface PaddingProps {
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingVertical?: number | string;
  paddingHorizontal?: number | string;
  padding?: number | string;
  paddingStart?: number | string;
  paddingEnd?: number | string;
}

interface MarginProps {
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginVertical?: number | string;
  marginHorizontal?: number | string;
  margin?: number | string;
}

interface SideProps {
  left?: number | string | boolean;
  right?: number | string | boolean;
  top?: number | string | boolean;
  bottom?: number | string | boolean;
}

interface FlexLayoutProps {
  flex?: number | string | boolean;
  flexGrow?: number | string | boolean;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flexShrink?: number | string | boolean;
  flexBasis?: number | string;
}

interface SizeProps {
  height?: number | string | boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  width?: number | string | boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  sizeWH?: number | string;
}

export type AlignSelfType = 'auto' | FlexAlignType;
export type JustifyContentType = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignContentType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';

interface ShadowProps {
  elevation?: number;
}

interface AlignProps {
  alignItems?: FlexAlignType;
  alignSelf?: AlignSelfType;
  justifyContent?: JustifyContentType;
  centerContent?: boolean;
  alignContent?: AlignContentType;
}

interface BorderProps {
  radius?: number | string;
  topRadius?: number | string;
  bottomRadius?: number | string;
  leftRadius?: number | string;
  rightRadius?: number | string;
  bottomLeftRadius?: number;
  topRightRadius?: number;
  topLeftRadius?: number;
  bottomRightRadius?: number;
  circle?: number;
  overflow?: 'visible' | 'hidden' | 'scroll' | boolean;
  borderColor?: string;
  borderWidth?: number;
  borderBottomWidth?: number;
  borderTopWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
}

interface TransformProps {
  animated?: boolean;
  rotate?: string | Animated.AnimatedNode;
  translateX?: number | Animated.AnimatedNode;
  translateY?: number | Animated.AnimatedNode;
  scale?: number | Animated.AnimatedNode;
  scaleX?: number | Animated.AnimatedNode;
}

export type DisplayType = 'none' | 'flex';

interface DisplayProps {
  display?: DisplayType;
}

export interface FlexProps extends PaddingGridProps, MarginGridProps, SideProps, SizeProps,
    PaddingProps, MarginProps, FlexLayoutProps, FlexDirectionProps, AlignProps,
    PositionProps, ShadowProps, BorderProps, TransformProps, ColorProps, DisplayProps {}

interface FlexViewDecoratorOpts {
  ignore?: (keyof FlexProps)[];
}

type TransformsStyleProps = (
    | { rotate: string }
    | { translateX: number }
    | { translateY: number }
    | { scale: number }
    | { scaleX: number }
    )[];

// Helper functions
const isTruthy = (v: any) => !!v;

function extractStyleProp<P extends object> (
  props: P,
  key: keyof P,
  setter: (v: any) => void,
  transformer?: (v: any) => any,
) {
  const value = props[key];
  if (value !== undefined) {
    setter(transformer ? transformer(value) : value);
    delete props[key];
  }
}

// Style processors
const styleProcessors = {
  color: (props: ColorProps, ss: ViewStyle) => {
    extractStyleProp(props, 'bg', v => ss.backgroundColor = v);
  },

  flexDirection: (props: FlexDirectionProps, ss: ViewStyle) => {
    const { row, reverse } = props;
    if (row || reverse) {
      let direction = row ? 'row' : 'column';
      if (reverse) {direction += '-reverse';}
      ss.flexDirection = direction as any;
    }

    extractStyleProp(props, 'wrap', v => {
      ss.flexWrap = v === true ? 'wrap' : v;
    });
  },

  position: (props: PositionProps, ss: ViewStyle) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extractStyleProp(props, 'absolute', v => ss.position = 'absolute', isTruthy);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extractStyleProp(props, 'relative', v => ss.position = 'relative', isTruthy);
    extractStyleProp(props, 'zIndex', v => ss.zIndex = v);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extractStyleProp(props, 'absoluteFill', v => {
      ss.position = 'absolute';
      ss.left = ZERO;
      ss.right = ZERO;
      ss.top = ZERO;
      ss.bottom = ZERO;
    }, isTruthy);
  },

  paddingGrid: (props: PaddingGridProps, ss: ViewStyle) => {
    extractStyleProp(props, 'pl', v => ss.paddingLeft = v);
    extractStyleProp(props, 'pr', v => ss.paddingRight = v);
    extractStyleProp(props, 'pt', v => ss.paddingTop = v);
    extractStyleProp(props, 'pb', v => ss.paddingBottom = v);
    extractStyleProp(props, 'pv', v => ss.paddingVertical = v);
    extractStyleProp(props, 'ph', v => ss.paddingHorizontal = v);
    extractStyleProp(props, 'pa', v => ss.padding = v);
  },

  marginGrid: (props: MarginGridProps, ss: ViewStyle) => {
    extractStyleProp(props, 'ml', v => ss.marginLeft = v);
    extractStyleProp(props, 'mr', v => ss.marginRight = v);
    extractStyleProp(props, 'mt', v => ss.marginTop = v);
    extractStyleProp(props, 'mb', v => ss.marginBottom = v);
    extractStyleProp(props, 'mv', v => ss.marginVertical = v);
    extractStyleProp(props, 'mh', v => ss.marginHorizontal = v);
    extractStyleProp(props, 'ma', v => ss.margin = v);
  },

  padding: (props: PaddingProps, ss: ViewStyle) => {
    extractStyleProp(props, 'paddingLeft', v => ss.paddingLeft = v);
    extractStyleProp(props, 'paddingRight', v => ss.paddingRight = v);
    extractStyleProp(props, 'paddingTop', v => ss.paddingTop = v);
    extractStyleProp(props, 'paddingBottom', v => ss.paddingBottom = v);
    extractStyleProp(props, 'paddingVertical', v => ss.paddingVertical = v);
    extractStyleProp(props, 'paddingHorizontal', v => ss.paddingHorizontal = v);
    extractStyleProp(props, 'padding', v => ss.padding = v);
    extractStyleProp(props, 'paddingStart', v => ss.paddingStart = v);
    extractStyleProp(props, 'paddingEnd', v => ss.paddingEnd = v);
  },

  margin: (props: MarginProps, ss: ViewStyle) => {
    extractStyleProp(props, 'marginLeft', v => ss.marginLeft = v);
    extractStyleProp(props, 'marginRight', v => ss.marginRight = v);
    extractStyleProp(props, 'marginTop', v => ss.marginTop = v);
    extractStyleProp(props, 'marginBottom', v => ss.marginBottom = v);
    extractStyleProp(props, 'marginVertical', v => ss.marginVertical = v);
    extractStyleProp(props, 'marginHorizontal', v => ss.marginHorizontal = v);
    extractStyleProp(props, 'margin', v => ss.margin = v);
  },

  side: (props: SideProps, ss: ViewStyle) => {
    extractStyleProp(props, 'left', v => ss.left = v === true ? ZERO : v);
    extractStyleProp(props, 'right', v => ss.right = v === true ? ZERO : v);
    extractStyleProp(props, 'top', v => ss.top = v === true ? ZERO : v);
    extractStyleProp(props, 'bottom', v => ss.bottom = v === true ? ZERO : v);
  },

  flex: (props: FlexLayoutProps, ss: ViewStyle) => {
    extractStyleProp(props, 'flex', v => ss.flex = v === true ? DEFAULT_TRUE_VALUE : v);
    extractStyleProp(props, 'flexGrow', v => ss.flexGrow = v === true ? DEFAULT_TRUE_VALUE : v);
    extractStyleProp(props, 'flexShrink', v => ss.flexShrink = v === true ? DEFAULT_TRUE_VALUE : v);
    extractStyleProp(props, 'flexBasis', v => ss.flexBasis = v === true ? DEFAULT_TRUE_VALUE : v);
  },

  size: (props: SizeProps, ss: ViewStyle) => {
    extractStyleProp(props, 'width', v => ss.width = v === true ? '100%' : v);
    extractStyleProp(props, 'height', v => ss.height = v === true ? '100%' : v);
    extractStyleProp(props, 'minHeight', v => ss.minHeight = v);
    extractStyleProp(props, 'maxHeight', v => ss.maxHeight = v);
    extractStyleProp(props, 'minWidth', v => ss.minWidth = v);
    extractStyleProp(props, 'maxWidth', v => ss.maxWidth = v);
    extractStyleProp(props, 'sizeWH', v => {ss.width = v;ss.height = v;});
  },
};

export const getStyleWithoutCache = (style: StyleProp<ViewStyle>, flexViewStyle: FlexStyle) => {
  const { opacity, ...styleSource } = {
    ...StyleSheet.flatten(style),
    ...flexViewStyle,
  };

  if (opacity !== undefined && (typeof opacity === 'number')) {
    (styleSource as ViewStyle).opacity = opacity;
  }

  return { style: styleSource };
};

export const getStyle = getStyleWithoutCache;

export function flexViewPropsStyle<P> (
  inProps: FlexProps & P,
  opts?: FlexViewDecoratorOpts,
): { styleSource: FlexStyle; restProps: P } {
  const passProps = { ...inProps };
  const ignoreProps = opts?.ignore?.reduce((acc, prop) => {
    if (passProps[prop] !== undefined) {
      acc[prop] = passProps[prop];
      delete passProps[prop];
    }

    return acc;
  }, {} as Record<string, any>) || {};

  const {
    alignItems,
    alignSelf,
    justifyContent,
    centerContent,
    elevation,
    radius,
    topRadius,
    bottomRadius,
    leftRadius,
    rightRadius,
    bottomLeftRadius,
    topRightRadius,
    topLeftRadius,
    bottomRightRadius,
    circle,
    overflow,
    rotate,
    translateX,
    translateY,
    scale,
    scaleX,
    borderColor,
    borderWidth,
    borderBottomWidth,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth,
    opacity,
    display,
    ...props
  } = passProps;

  const ss: ViewStyle = {};

  // Alignment
  if (centerContent) {
    ss.alignItems = 'center';
    ss.justifyContent = 'center';
  }
  if (alignItems) {ss.alignItems = alignItems;}
  if (alignSelf) {ss.alignSelf = alignSelf;}
  if (justifyContent) {ss.justifyContent = justifyContent;}
  if (elevation !== undefined) {Object.assign(ss, shadowStyle(elevation));}

  // Borders
  if (circle && Number.isFinite(circle)) {
    ss.width = circle;
    ss.height = circle;
    ss.borderRadius = circle / 2;
  }
  if (radius) {ss.borderRadius = radius as any;}
  if (topRadius) {
    ss.borderTopLeftRadius = topRadius as any;
    ss.borderTopRightRadius = topRadius as any;
  }
  if (bottomRadius) {
    ss.borderBottomLeftRadius = bottomRadius as any;
    ss.borderBottomRightRadius = bottomRadius as any;
  }
  if (leftRadius) {
    ss.borderBottomLeftRadius = leftRadius as any;
    ss.borderTopLeftRadius = leftRadius as any;
  }
  if (rightRadius) {
    ss.borderBottomRightRadius = rightRadius as any;
    ss.borderTopRightRadius = rightRadius as any;
  }
  if (bottomLeftRadius) {ss.borderBottomLeftRadius = bottomLeftRadius as any;}
  if (topRightRadius) {ss.borderTopRightRadius = topRightRadius as any;}
  if (topLeftRadius) {ss.borderTopLeftRadius = topLeftRadius as any;}
  if (bottomRightRadius) {ss.borderBottomRightRadius = bottomRightRadius as any;}

  if (borderColor) {ss.borderColor = borderColor;}
  if (borderWidth) {ss.borderWidth = borderWidth;}
  if (borderBottomWidth) {ss.borderBottomWidth = borderBottomWidth;}
  if (borderTopWidth) {ss.borderTopWidth = borderTopWidth;}
  if (borderLeftWidth) {ss.borderLeftWidth = borderLeftWidth;}
  if (borderRightWidth) {ss.borderRightWidth = borderRightWidth;}
  if (opacity !== undefined) {ss.opacity = opacity as any;}
  if (display) {ss.display = display;}

  // Overflow
  if (overflow !== undefined) {
    ss.overflow = overflow === false ? HIDDEN : (overflow === true ? VISIBLE : overflow);
  }

  // Transforms
  const transform: TransformsStyleProps = [];
  if (rotate) {transform.push({ rotate: rotate as string });}
  if (translateX) {transform.push({ translateX: translateX as number });}
  if (translateY) {transform.push({ translateY: translateY as number });}
  if (scale) {transform.push({ scale: scale as number });}
  if (scaleX) {transform.push({ scaleX: scaleX as number });}
  if (transform.length) {ss.transform = transform;}

  // Process all style props
  Object.values(styleProcessors).forEach(processor => processor(props, ss));

  // Restore ignored props
  Object.assign(props, ignoreProps);

  return { styleSource: ss as FlexStyle, restProps: props as P };
}
