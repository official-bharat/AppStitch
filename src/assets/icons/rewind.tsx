import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const RewindIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" fill={props.fill || '#ffffff'} />
  </Svg>
);
