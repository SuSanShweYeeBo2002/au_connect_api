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

server.listen(process.env.PORT || config.port)

export default server
