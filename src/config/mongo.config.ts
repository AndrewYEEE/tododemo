import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => {
  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const resource = process.env.MONGO_RESOURCE;
  const db = process.env.MONGO_DB;
  const uri = `mongodb://${username}:${password}@${resource}/${db}?retryWrites=true&w=majority`;
  return { username, password, resource, db, uri };
});