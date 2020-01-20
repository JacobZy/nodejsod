// 服务器端实现
const fs = require('fs')
const tls = require('tls')
const net = require('net')
const proxy = require('proxy') // 记得将proxy添加到你的package.json依赖中

// 1. 创建一个TLS服务来加密数据 (记得签发你自己的证书)
const options = {
  key: fs.readFileSync(__dirname + '/keys/across.key'),
  cert: fs.readFileSync(__dirname + '/keys/across.pem'),
}
const server = tls.createServer(null, (socket) => {
  socket.pause()

  // 连接并转发数据到本机的代理服务器
  const remoteSocket = net.connect(3738, '127.0.0.1', () => {
    socket.pipe(remoteSocket)
    remoteSocket.pipe(socket)

    socket.resume()
  })

  socket.on('error', () => {})
  socket.on('end', () => {})
})

// 2. 创建一个本机的代理服务器(站在巨人的肩膀上)
const proxyServer = proxy()
proxyServer.listen(3738, '127.0.0.1', () => {
  const port = proxyServer.address().port
  console.log('proxy server listening on port %d', port)
})

// 3. 启动TLS服务
server.listen(443, () => {
  console.log('server bound 37637')
})
