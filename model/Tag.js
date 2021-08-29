import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Tag extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('testDB.db')
  }

  static get tableName() {
    return 'tag'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      name: { type: types.TEXT, not_null: true },
      color: { type: types.TEXT, not_null: true}
    }
  }
}