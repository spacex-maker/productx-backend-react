import { theme } from 'antd';
const dark = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#5856d6',
    colorLink: '#5856d6',
    marginLG: 16,
    colorBgContainer: '#212631',
  },
  components: {
    Button: {},
  },
};
const light = {
  token: {
    colorPrimary: '#5856d6',
    colorLink: '#5856d6',
    marginLG: 16,
  },
  components: {
    Button: {},
  },
};
export const CustomTheme = {
  dark,
  light,
  auto: light,
};
