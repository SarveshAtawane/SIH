const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "src/index.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.min.js",
        assetModuleFilename: "[name][ext]",
    },
    module: {
        rules: [
            // CSS handling
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            // File handling for image assets (GIF, SVG, JPG, PNG)
            {
                test: /\.(gif|svg|jpg|png)$/,
                loader: "file-loader",
                options: {
                    limit: 10000,
                    name: "assets/[name].[ext]",
                },
            },
            // JavaScript/React files handling (now includes both .js and .jsx)
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    presets: [
                        "@babel/preset-env",
                        [
                            "@babel/preset-react",
                            {
                                runtime: "automatic", // Enables new JSX Transform
                            },
                        ],
                    ],
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Add .jsx here so Webpack can resolve JSX files
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
