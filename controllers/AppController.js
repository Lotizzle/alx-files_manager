// controllers/AppController.js
const redisClient = require('../utils/redis'); // Import your redis utility
const dbClient = require('../utils/db'); // Import your db utility

class AppController {
  static async getStatus(req, res) {
    try {
      const redisStatus = redisClient.isAlive(); // Your method to check if Redis is alive
      const dbStatus = dbClient.isAlive(); // Your method to check if DB is alive
      res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers(); // Your method to get the number of users
      const filesCount = await dbClient.nbFiles(); // Your method to get the number of files
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

module.exports = AppController;
