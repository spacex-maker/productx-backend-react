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
    Table: {
      borderColor: '#dbdfe6',
      rowHoverBg: 'rgba(88,86,214,0.4)',
    },
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
    Table: {
      borderColor: '#dbdfe6',
      rowHoverBg: 'rgba(88,86,214,0.4)',
    },
  },
};
export const CustomTheme = {
  dark,
  light,
  auto: light,
};
