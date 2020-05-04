/*
*
*/
const path                        = require('path');
const webpack                     = require("webpack");
const HtmlWebpackPlugin           = require('html-webpack-plugin') ;
const express                     = require('express') ;
//
let tempURLbackend = process.env.URL_BACKEND ? process.env.URL_BACKEND : "http://localhost:3001" ;
if ( tempURLbackend.substr((tempURLbackend.length-1),1)=="/"){ tempURLbackend=tempURLbackend.substr(0,(tempURLbackend.length-1)); }
//
let fileName = 'testWidgetBundl.js' ;
//
module.exports = {
  entry: './test/testReactWidget.js',
  //entry: "./test/testReactWidget.html",
  output: {
    filename: fileName,
    path: path.join(__dirname, '../build')
    //publicPath: '../build'
  },
  module:{
	   rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
        //loader: 'url-loader?limit=false'
        // Muy importante indicar la direccion para buscar por nombre "/" indica que busca en directorio raiz
        loader: 'file-loader?name=/[name].[ext]',
     },
     {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: '65-90',
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            },
            // the webp option will enable WEBP
            webp: {
              quality: 75
            }
          }
        },
      ]
     }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx','.css'],
    modules: [ path.join(__dirname,'../node_modules') ]
  },
  resolveLoader: {
    modules: [ path.join(__dirname,'../node_modules') ]
  },
  devServer: {
    port: 9003,
    open: true,
    contentBase: path.join(__dirname, '../build' ),
    // watchContentBase: true,
    /*
    setup(app){
      app.use('/', express.static('/test/'));
    },
    */
   /*
    before: function(app, server, compiler) {
      let staticPath = require('path').join(__dirname,'../build')
      console.log('\n\n before::staticPath: ',staticPath,'\n\n');
      app.use('/', express.static( staticPath )) ;
      //
      app.get('/', function(req, res) {
        res.set('access-Control-Allow-Origin', '*');
        res.set('access-Control-Allow-Methods', '*');
        res.set("Access-Control-Allow-Headers","X-PINGOTHER, Content-Type" ) ;
        res.setHeader("Access-Control-Allow-Credentials", true);
        //
        res.sendFile( path.join(__dirname,'../build/waiboc.html') );
        //
      });
      //
    },
    */
   /*
   after: function(app, server, compiler) {
      console.log('....after:: app: ',app,' server: ',server) ;
    },
    */
   /*
    proxy: {
        "/5df990135940bb454c846a1e": "http://localhost:3001/5df990135940bb454c846a1e",
        "/5e944932a6f5c53ad8bac8b3": "http://localhost:3001/5e944932a6f5c53ad8bac8b3"
    },
    */
    //open: true,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }
    //publicPath: "/test",
  },
  plugins: [
    new HtmlWebpackPlugin({
      // filename: "testReactWidget.html",
      filename: "waiboc.html",
      template: "./test/testReactWidget.html",
      title:"testReactWidge",
      inject: true,
      prefix: '/',
      minify: false,
      hash:true
    })
  ]
};
//