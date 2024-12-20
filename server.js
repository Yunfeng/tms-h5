const express = require('express');
const proxy = require('http-proxy-middleware')
const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const server = express();

console.log('isProd: ' + isProd)

function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

//tomcat应用设置的cookie在这个路径下
if (!isProd) {
  server.use('/eotms', proxy({
    target: 'http://172.168.1.24:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/eotms': '/'
    },
    xfwd: true
  }))
  server.use('/api', proxy({
    target: 'http://localhost:8000',
    changeOrigin: true
  }))
}

server.use('/dist', express.static(path.join(__dirname, './dist')));
server.use('/public', serve('./public', true));



//start server
server.get('*', (req, res) => {
  const s = Date.now()
  console.log('url:' + req.url)
  const context = {
    url: req.url,
    meta: `<meta description="企业在线差旅管理系统 Enterprise Online Travel Management System TMS vuejs ssr">`,
    title: '企业差旅系统 - EOTMS'
  }
  // No need to pass an app here because it is auto-created by
  // executing the bundle. Now our server is decoupled from our Vue app!
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log('error: ' + err.code)
      console.log('context:' + context)
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
})



server.listen(8090);