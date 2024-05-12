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
    const db = this.client.db();
    const usersCollection = await db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const db = this.client.db();
    const filesCollection = await db.collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
// module.exports = dbClient;
export default dbClient;
