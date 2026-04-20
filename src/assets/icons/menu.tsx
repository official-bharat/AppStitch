import * as React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */
export const MenuIcon: React.FC<SvgProps> = props => (
  <Svg
    fill="#000000"
    width="24px"
    height="24px"
    viewBox="0 0 36 36"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <Path d="M32,29H4a1,1,0,0,1,0-2H32a1,1,0,0,1,0,2Z" />
    <Path d="M32,19H4a1,1,0,0,1,0-2H32a1,1,0,0,1,0,2Z" />
    <Path d="M32,9H4A1,1,0,0,1,4,7H32a1,1,0,0,1,0,2Z" />
    <Rect x={0} y={0} width={36} height={36} fillOpacity={0} />
  </Svg>
);
