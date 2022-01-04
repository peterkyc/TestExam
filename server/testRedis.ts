import { rs } from "../common/utils";
import { createRedisClient, testMain } from "./util";

function setRedis(client, key: string, map) {
  const mapJson = Object.keys(map).reduce((m, n) => rs(m[n] = JSON.stringify(map[n]), m), {});
  const rc = client.hset(key, mapJson);
}
function setRedisKey(client, folder, key: string, value: any) {
  const map = { [key]: value };
  return setRedis(client, folder, map);
}


async function main() {
  const host = "192.168.1.128", port = 16379, url = `redis://${host}:${port}`;
  const client = createRedisClient({ host, port });
  const data = { userId: "peterkyc@hotmail.com", password: "!@#$%^&*()_", name: "Peter Chang" };
  const folder = "folder", key = 'key12';
  client.on('error', (err) => console.log('Redis Client Error', err));

  let rc = await setRedisKey(client,folder, key, data);
  let value = await client.hget(folder, key);
  await client.hdel(folder, key);
  console.log(`set:${rc} and get redis`, data, value)
}



if (testMain(__filename)) {
  main();
}