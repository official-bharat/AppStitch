import React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const CheckmarkIcon: React.FC<SvgProps> = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={12} fill="#34C759" />
    <Path
      d="M7 12.5L10.5 16L17 9"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
