import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
const fileExists = (path) => fs.stat(path).then(() => true, () => false);

async function createLocalFile(b64Data) {
  try {
    const dataBuffer = Buffer.from(b64Data, 'base64');
    if (!await fileExists(folderPath)) {
      await fs.mkdir(folderPath);
    }
    const filePath = path.join(folderPath, uuidv4());
    await fs.writeFile(filePath, dataBuffer);
    return path.resolve(filePath);
  } catch (err) {
    return null;
  }
}

export default createLocalFile;
