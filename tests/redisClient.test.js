import { expect } from 'chai';
import redisClient from '../utils/redis';

describe('RedisClient', () => {
  it('should connect to Redis', async () => {
    expect(redisClient.isAlive()).to.be.true;
  });

  it('should set and get a value', async () => {
    await redisClient.set('testKey', 'testValue', 10);
    const value = await redisClient.get('testKey');
    expect(value).to.equal('testValue');
  });

  it('should expire a key', async () => {
    await redisClient.set('expiringKey', 'expiringValue', 1);
    await new Promise(resolve => setTimeout(resolve, 1100));
    const value = await redisClient.get('expiringKey');
    expect(value).to.be.null;
  });
});
