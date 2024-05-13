import mongoDBCore from 'mongodb/lib/core';
import createLocalFile from '../utils/files';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const {
      name, type, parentId, isPublic, data,
    } = req.body;
    const userId = req.user._id.toString();
    let newFileObj = {};

    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }
    if (!type) {
      res.status(400).json({ error: 'Missing type' });
      return;
    }
    if (!data && type !== 'folder') {
      res.status(400).json({ error: 'Missing data' });
      return;
    }
    if (parentId) {
      const parent = await (await dbClient.filesCollection())
        .findOne({ _id: new mongoDBCore.BSON.ObjectId(parentId) });
      if (!parent) {
        res.status(400).json({ error: 'Parent not found' });
        return;
      }
      if (parent.type !== 'folder') {
        res.status(400).json({ error: 'Parent is not a folder' });
        return;
      }
    }
    newFileObj = {
      name,
      type,
      parentId: parentId || 0,
      isPublic: isPublic || false,
      userId,
    };
    if (type !== 'folder') {
      const filePath = await createLocalFile(data);
      if (filePath) {
        newFileObj.localPath = filePath;
      } else throw Error(`Could not create file ${name}`);
    }
    const dupFileObj = { ...newFileObj };
    await (await dbClient.filesCollection()).insertOne(dupFileObj);
    const { _id } = dupFileObj;
    // console.log({ id: _id, ...newFileObj });
    res.status(201).json({ id: String(_id), ...newFileObj });
  }
}

export default FilesController;
