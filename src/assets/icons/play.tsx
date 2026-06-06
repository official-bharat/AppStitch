import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const PlayIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M8 5v14l11-7z" fill={props.fill || '#ffffff'} />
  </Svg>
);
