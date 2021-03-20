import { reactive } from 'vue';
import { Dexie } from 'dexie';

export default (name, version) => {
  const db = reactive(new Dexie(name));
  db.version(version).stores({
    homework: '&id',
  });

  return db;
};
