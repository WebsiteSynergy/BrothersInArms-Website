const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

 module: {
   rules: [
    {
        test: /\.html$/,
        use: [
            'file-loader?name=[name].[ext]', 
            'extract-loader', 
            {
                loader: 'html-loader',
                options: {
                  esModule: false,
                }
            },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
     {
       test: /\.(png|svg|jpg|jpeg|gif)$/i,
       type: 'asset/resource',
     },      
   ],
 },
};