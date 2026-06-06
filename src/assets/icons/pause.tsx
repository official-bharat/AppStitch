import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const PauseIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={props.fill || '#ffffff'} />
  </Svg>
);
