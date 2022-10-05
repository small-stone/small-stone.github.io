module.exports = {
  theme: "gungnir",
  title: "小石头的前端博客",
  codeTheme: "coy",
  themeConfig: {
    search: false,
    nav: [
      { text: "首页", link: "/" },
      { text: "前端基础", link: "/f2e/" },
      { text: "算法", link: "/bar/" },
    ],
    sidebar: {
      "/f2e/": [
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

    personalInfo: {
      name: "小石头",
      avatar: "/avatar.jpeg",
      description: "且将新火试新茶。诗酒趁年华。",
      // 可选：社交平台账号，将在首页和移动端侧边栏显示
      sns: {
        github: "small-stone", // Github
        linkedin: "xiaohan-zou-55bba0160", // 领英
        facebook: "renovamen.zou", // Facebook
        twitter: "renovamen_zxh", // 推特
        zhihu: "chao-neng-gui-su", // 知乎
        weibo: "your-weibo-id", // 新浪微博
        email: "342206015@qq.com", // 邮箱
      },
    },
    homeHeaderImages: {
      // 可选：首页本地封面图路径和蒙版
      local: [
        // 图 1
        {
          path: "/bg1.jpeg",
          mask: "rgba(40, 57, 101, .4)",
        },
        // 图 2
        {
          path: "/bg2.jpeg",
          mask: "rgb(251, 170, 152, .2)",
        },
      ],
    },
    hitokoto: {
      api: "https://v1.hitokoto.cn/?c=i", // 只返回诗词
    },
  },
};
