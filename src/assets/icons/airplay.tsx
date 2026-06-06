import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const AirPlayIcon: React.FC<SvgProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    {/* Left AirPod */}
    <Path
      d="M8.5 5C7.12 5 6 6.12 6 7.5C6 8.5 6.6 9.3 7.5 9.7V17c0 .55.45 1 1 1s1-.45 1-1V7.5c0-.83.67-1.5 1.5-1.5.55 0 1-.45 1-1s-.45-1-1.5-1z"
      fill={props.fill || '#ffffff'}
    />
    {/* Right AirPod */}
    <Path
      d="M15.5 5C14.62 5 13.5 6.12 13.5 7.5v9.5c0 .55.45 1 1 1s1-.45 1-1V9.7c.9-.4 1.5-1.2 1.5-2.2C17 6.12 15.88 5 15.5 5z"
      fill={props.fill || '#ffffff'}
    />
  </Svg>
);
