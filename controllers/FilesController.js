import mongoDBCore from 'mongodb/lib/core/';
import { createLocalFile } from '../utils/files';
import dbClient from '../utils/db';
// import ObjectId from "mongodb";

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
      // if (ObjectId.isValid(parentId))
      const parent = await (
        await dbClient.filesCollection()
      ).findOne({ _id: new mongoDBCore.BSON.ObjectId(parentId) });

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
      parentId: parentId || '0',
      isPublic: isPublic || false,
      userId,
    };
    if (type !== 'folder') {
      const filePath = await createLocalFile(data);
      if (filePath) {
        newFileObj.localPath = filePath;
      } else throw Error(`Could not create file ${name}`);
    }
    await (await dbClient.filesCollection()).insertOne(newFileObj);
    const { _id } = newFileObj;
    delete newFileObj.localPath;
    delete newFileObj._id;

    res.status(201).json({ id: String(_id), ...newFileObj });
  }

  static async getShow(req, res) {
    const userId = req.user._id.toString();
    const fileId = req.params.id;

    const file = await (await dbClient.filesCollection())
      .findOne({ _id: new mongoDBCore.BSON.ObjectId(fileId), userId });
    if (!file) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    delete file._id;
    delete file.localPath;
    res.json({ id: fileId, ...file });
  }

  static async getIndex(req, res) {
    const parentId = req.query.parentId || undefined;
    const page = Number(req.query.page) || 0;

    const files = await (await (await dbClient.filesCollection())
      .aggregate([
        { $match: { parentId: parentId || { $exists: true } } },
        { $skip: page * 20 },
        { $limit: 20 },
      ]).toArray());

    files.forEach((file) => {
      const fileDup = file;
      fileDup.id = fileDup._id.toString();
      delete fileDup._id;
      delete fileDup.localPath;
    });
    res.json(files);
  }
}

export default FilesController;
