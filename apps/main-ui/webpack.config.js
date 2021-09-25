const getWebpackConfig = require('@nrwl/react/plugins/webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const darkTheme = require('@ant-design/dark-theme');
const  AntdDayjsWebpackPlugin=  require("antd-dayjs-webpack-plugin");

function getCustomWebpackConfig(webpackConfig) {
  const config = getWebpackConfig(webpackConfig);

  // config?.resolve?.plugins.push(new AntdDayjsWebpackPlugin());

  
  
  config.plugins.push(new AntdDayjsWebpackPlugin())
  console.log(config, "config")

 


//    config.module.rules[1].oneOf[6].use.push({
//      loader : 'less-loader',
//      options: {
//        modifyVars: darkTheme
//      }
//    })

// config?.module?.rules[1]?.oneOf[4]?.use?.push({
//   import: {
//     filter:(url, media, resourcePath)=>{
//       console.log(url, media, resourcePath)
//     }
//   }
// })

//  console.log(config.module.rules[1].oneOf[6], "less item")

// console.log(config.module.rules[1].oneOf[4])

 return config


  
  
}

module.exports = getCustomWebpackConfig;

