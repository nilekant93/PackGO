import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: '#5bc0be',    // vihreä painikkeisiin ja korostuksiin
    secondary: '#1c2541',  // tumma sininen taustalle
    background: '#0b132b', // tumma sininen päätaustalle
    surface: '#0b132b',    // surface eli kortit myös tumma sininen
    onSurface: '#FFFFFF',   // tekstit kortilla / pinnalla
    text: '#FFFFFF',        // pääteksti
    onPrimary: '#FFFFFF',   // tekstiväri painikkeissa
    outline: '#BBBBBB',     // mahdolliset rajaukset
  },
  roundness: 16,
};
