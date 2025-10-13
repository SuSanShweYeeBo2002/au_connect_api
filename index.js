import http from 'http'
import setupExpress from './src/loaders/express.js'
import setupMongoose from './src/loaders/mongoose.js'
import initializeSocket from './src/loaders/socket.js'
import config from './src/config/index.js'

await setupMongoose().catch(err => console.error(err))

const app = await setupExpress()
const server = http.createServer(app)

// Initialize Socket.IO
const io = initializeSocket(server)

// Make Socket.IO and connected users available to express app
app.set('io', io)
app.set('connectedUsers', server.connectedUsers || new Map())

const port = process.env.PORT || config.port
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`)
  console.log(`📊 Debug endpoint: http://localhost:${port}/debug/sockets`)
  console.log(`🏥 Health check: http://localhost:${port}/health`)
  console.log(`📄 API docs: http://localhost:${port}/docs`)
})

export default server
