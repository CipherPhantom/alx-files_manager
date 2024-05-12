import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const db = dbClient.client.db();
    const usersCollection = await db.collection('users');
    const user = await usersCollection.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }

    const hashedPassword = sha1(password);
    const result = await usersCollection.insertOne({ email, password: hashedPassword });

    res.json({ id: result.insertedId, email });
  }
}

export default UsersController;
