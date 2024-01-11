const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, options) => {
  console.log(options);
  const {
    mode, // undefined when called from eslint, .eslintrc.json:settings.import/resolver.webpack.config
  } = options;

  const outputPath = path.resolve(__dirname, `./build/`);

  const ignore = ["**/.DS_Store"];
  const assets = [
    {
      from: "./assets",
      to: "./",
      globOptions: { ignore },
    },
  ];

  const config = {
    mode,
    stats: { excludeModules: false, exclude: undefined, modules: true },
    devtool: mode === "development" ? "cheap-module-source-map" : false,
    context: path.resolve("./"),
    entry: {
      "admin-panel": ["./src/index.jsx"],
    },
    output: {
      path: outputPath,
      pathinfo: true,
    },
    module: {
      rules: [
        { test: /\.jsx$/, exclude: [/node_modules/], use: ["babel-loader"] },
      ],
    },
    resolve: {
      modules: [path.resolve(path.join(__dirname, "src")), "node_modules"],
      mainFiles: ["index"],
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new ESLintPlugin({ extensions: ["js", "jsx"] }),
      new CopyPlugin({ patterns: assets }),
    ],
  };
  return config;
};
