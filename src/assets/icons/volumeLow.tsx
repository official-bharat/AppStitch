import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const VolumeLowIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M7 9v6h4l5 5V4l-5 5H7z" fill={props.fill || '#ffffff'} />
    <Path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill={props.fill || '#ffffff'} />
  </Svg>
);
