module.exports = ({ mode }) => {
  const pathToMainJs = require.resolve("./src/main.js");
  const pathToIndexHtml = require.resolve("./src/index.html");

  return {
      mode,
      entry: [
          pathToMainJs,
          pathToIndexHtml
      ],
      module: {
          rules: [
              {
                  test: pathToIndexHtml,
                  use: [
                      "file-loader",
                      "extract-loader",
                      {
                          loader: "html-loader",
                          options: {
                            esModule: false,
                            sources: {
                              list: [
                                // All default supported tags and attributes
                                "...",
                                {
                                  tag: "img",
                                  attribute: "data-src",
                                  type: "src",
                                },
                                {
                                  tag: "img",
                                  attribute: "data-srcset",
                                  type: "srcset",
                                },
                              ],
                              urlFilter: (attribute, value, resourcePath) => {
                                // The `attribute` argument contains a name of the HTML attribute.
                                // The `value` argument contains a value of the HTML attribute.
                                // The `resourcePath` argument contains a path to the loaded HTML file.
                  
                                if (/\.svg$/.test(value)) {
                                  return false;
                                }
                  
                                return true;
                              },
                            }
                          }
                      }
                  ]
              },
              {
                  test: /\.css$/,
                  use: [
                      "file-loader",
                      "extract-loader",
                      {
                          loader: "css-loader",
                          options: {
                              sourceMap: true,
                              esModule: false,
                          }
                      }
                  ]
              },
              {
                  test: /\.jpg$/,
                  use: "file-loader"
              },
              {
                test: /\.svg$/,
                type: "asset/resource"
            }
          ]
      }
  };
}
