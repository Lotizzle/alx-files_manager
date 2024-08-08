import Bull from 'bull';
import { ObjectId } from 'mongodb';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import express from 'express';
import dbClient from './utils/db';
import router from './routes/index';

const fileQueue = new Bull('fileQueue');

const generateThumbnail = async (path, options) => {
  try {
    const thumbnail = await imageThumbnail(path, options);
    const thumbnailPath = `${path}_${options.width}`;
    await fs.promises.writeFile(thumbnailPath, thumbnail);
  } catch (error) {
    console.error(`Error generating thumbnail: ${error}`);
  }
};

fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.db.collection('files').findOne({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  if (!file) {
    throw new Error('File not found');
  }

  const sizes = [500, 250, 100];
  const thumbnailPromises = sizes.map((size) => generateThumbnail(file.localPath, { width: size }));

  await Promise.all(thumbnailPromises);
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
console.log('Worker is running');
