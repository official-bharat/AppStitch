import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ForwardIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" fill={props.fill || '#ffffff'} />
  </Svg>
);
