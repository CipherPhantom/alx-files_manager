import ObjectId from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

async function getUserFromXToken(req) {
  const token = req.headers['X-Token'];

  if (!token) {
    return null;
  }

  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    return null;
  }

  const user = await (await dbClient.usersCollection())
    .findOne({ _id: new ObjectId(userId) });
  return user || null;
}

async function xTokenAuthentication(req, res, next) {
  const user = await getUserFromXToken(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
}

export default xTokenAuthentication;
