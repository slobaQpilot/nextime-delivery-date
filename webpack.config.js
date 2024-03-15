const path = require("path");
module.exports = {
  entry: {
    "bundle.js": [
      path.resolve(
        __dirname,
        "dist/nextime-delivery-date/browser/polyfills.js"
      ),
      path.resolve(__dirname, "dist/nextime-delivery-date/browser/styles.css"),
      path.resolve(__dirname, "dist/nextime-delivery-date/browser/main.js"),
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/nextime-delivery-date/browser/"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
