打包多个 js 文件，推荐用 rollup.js，win7 上用不了最新的 rollup.js，因为 win7 支持的 node 版本只到 12，而最新的 rollup.js 至少要 14.19 版本的 node

我试了老版本的 rollup.js，比如 2.15.0，可以跑起来

打包命令：

```bash
rollup SudoKu/SudoKu.js --file SudoKu/bundle.js
```

这样打包了的话，SudoKu 引用了 DancingLinksX，就没问题了

不过要记得先编译好 ts，再打包 js
