import { TinyColor } from "@ctrl/tinycolor";

export const colors = {
  pink: "#6A2D8E",
  grey: "#858D92",
};

export const theme = {
  components: {
    Button: {
      colorPrimary: colors.pink,
      colorPrimaryHover: new TinyColor(colors.pink).lighten(5).toString(),
      colorPrimaryActive: new TinyColor(colors.pink).darken(5).toString(),
    },
    Card: {
      colorBgContainer: "linear-gradient(180deg, #232123 53.37%, rgba(99, 75, 112, 0.5) 100%)",
    },
  },
};
