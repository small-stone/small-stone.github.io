module.exports = {
  theme: "antdocs",
  title: "小石头的前端博客",
  description: "33322",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/foo/" },
      { text: "External", link: "/bar/" },
    ],
    sidebar: {
      "/foo/": [
        "" /* /foo/ */,
        "one" /* /foo/one.html */,
        "two" /* /foo/two.html */,
      ],

      "/bar/": [
        "" /* /bar/ */,
        "three" /* /bar/three.html */,
        "four" /* /bar/four.html */,
      ],
    },
  },
};
