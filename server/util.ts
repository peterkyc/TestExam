import * as path from "path";
import { rs } from "../common/utils";
import Redis from 'ioredis';

export function createRedisClient({ host = "127.0.0.1", port = 6379, db = 0, username = null, password = null }): Redis.Redis {
  const retryStrategy = (times) => Math.min(times * 50, 5000);
  const opts = { host, port, db, username, password, retryStrategy };
  const set = (m, n) => opts[n] != null && (m[n] = opts[n]);
  const options = Object.keys(opts).reduce((m, n) => rs(set(m, n), m), {});
  const redis = new Redis(options);
  return redis;
}


export function testMain(file) {
  try {
    if (file && process && process.argv && process.argv.length > 1 && process.argv[1]) {
      let a = path.parse(file).base, b = path.parse(process.argv[1]).base;
      return a.toLowerCase() == b.toLowerCase();
    }
  } catch (e) {
    console.error(e);
  }
}



export enum RedisKeys {
  MailVerify,
  UserLogin,
  UserSession,   
}