import React from "react";
import { View } from "react-native";
import { Svg, Polygon } from "react-native-svg";
import { ColLectiuRondaLogoProps } from "../../interfaces/interfaces";

export default function ColLectiuRondaLogo({ style }: ColLectiuRondaLogoProps) {
  return (
    <View style={style}>
      <Svg width="200" height="160" viewBox="0 0 100 80">
        <Polygon
          points="29,19 22.4,15.1 31.9,11.4 31.8,1.9 6.7,12.2 6.6,11.1 17.5,6.6 17.5,1.9 10.2,5.3 10.2,1.9 7.8,3 7.8,6.2 0.6,9.3 0.6,19 25.9,8.1 25.9,9.3 12.7,15.1 19.8,19"
          fill="#A03033"
          transform="matrix(2.6557469,0,0,2.6557469,7.3776885,0.66157877)"
        />
      </Svg>
    </View>
  );
}
