import MongoClient from 'mongodb';

class DBClient {
  constructor() {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

    const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

    this.client = new MongoClient(URI);
    this.client.then((client) => {
      this.client = client;
    });
  }

  isAlive() {
    if (this.client.db) return true;
    return false;
  }

  async nbUsers() {
    return this.usersCollection().countDocuments();
  }

  async nbFiles() {
    return this.filesCollection().countDocuments();
  }

  async usersCollection() {
    return this.client.db().collection('users');
  }

  async filesCollection() {
    return this.client.db().collection('files');
  }
}

const dbClient = new DBClient();
// module.exports = dbClient;
export default dbClient;
