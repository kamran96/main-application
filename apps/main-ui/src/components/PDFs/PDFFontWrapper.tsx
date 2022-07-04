import { View, Font, StyleSheet } from '@react-pdf/renderer';
import { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

Font.register({
  family: 'Roboto Slab',
  fonts: [
    { src: require('../../assets/fonts/RobotoSlab-Thin.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-Black.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-Black.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-ExtraBold.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-ExtraLight.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-Light.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-Medium.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-Regular.ttf') },
    { src: require('../../assets/fonts/RobotoSlab-SemiBold.ttf') },
  ],
});

const styles = StyleSheet.create({
  fontWrapper: {
    fontFamily: 'Roboto Slab',
  },
});

export const PDFFontWrapper: FC<IProps> = ({ children }) => {
  return <View style={styles.fontWrapper}>{children}</View>;
};
