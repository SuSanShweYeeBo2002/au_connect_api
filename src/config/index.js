const env = process.env.NODE_ENV || 'local'

const config = {
  test: {
    port: 8383,
    db: 'mongodb://localhost/blogs-db1'
  },
  local: {
    port: 8383,
    db: 'mongodb+srv://u6511106_db_user:199406jb@cluster0.coa8zpe.mongodb.net/au_connect?retryWrites=true&w=majority&appName=Cluster0'
  },
  dev: {
    port: 8383,
    db: 'mongodb://localhost/blogs-db'
  },
  staging: {
    port: 8383,
    db: 'mongodb://localhost/blogs-db'
  },
  production: {
    port: 8383,
    db: 'mongodb://localhost/blogs-db'
  }
}

export default {
  ...config[env]
}
