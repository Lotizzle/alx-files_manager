// redis.js

import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis client error', err);
    });

    this.client.on('ready', () => {
      console.log('Redis client connected to the server');
    });

    // Promisify the Redis client methods for async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    await this._ensureConnected();
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    await this._ensureConnected();
    await this.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    await this._ensureConnected();
    await this.delAsync(key);
  }

  _ensureConnected() {
    return new Promise((resolve, reject) => {
      if (this.isAlive()) {
        resolve();
      } else {
        this.client.once('ready', resolve);
        this.client.once('error', reject);
      }
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
