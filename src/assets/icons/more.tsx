import * as React from 'react';
import Svg, { Circle, SvgProps } from 'react-native-svg';

export const MoreIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={5} cy={12} r={2} fill={props.fill || '#ffffff'} />
    <Circle cx={12} cy={12} r={2} fill={props.fill || '#ffffff'} />
    <Circle cx={19} cy={12} r={2} fill={props.fill || '#ffffff'} />
  </Svg>
);
