const { redisClient } = require('./redis');

const isUpstash = !!process.env.UPSTASH_REDIS_REST_URL;

const get = async (key) => {
    try {
        const data = await redisClient.get(key);
        if (!data) return null;
        if (isUpstash) return data;
        return JSON.parse(data);
    } catch (error) {
        console.error('Cache GET error:', error.message);
        return null;
    }
};

const set = async (key, value, ttlSeconds) => {
    try {
        const serialized = JSON.stringify(value);
        if (isUpstash) {
            await redisClient.set(key, serialized, { ex: ttlSeconds || undefined });
        } else {
            if (ttlSeconds) {
                await redisClient.setEx(key, ttlSeconds, serialized);
            } else {
                await redisClient.set(key, serialized);
            }
        }
    } catch (error) {
        console.error('Cache SET error:', error.message);
    }
};

const del = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Cache DEL error:', error.message);
    }
};

const delPattern = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            if (isUpstash) {
                for (const key of keys) {
                    await redisClient.del(key);
                }
            } else {
                await redisClient.del(keys);
            }
        }
    } catch (error) {
        console.error('Cache DEL PATTERN error:', error.message);
    }
};

module.exports = { get, set, del, delPattern };
