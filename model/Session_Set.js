import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Session_Set extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('upgradeDB.db')
  }

  static get tableName() {
    return 'session_set'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      session_id: { type: types.INTEGER },
      set_id: { type: types.INTEGER },
      workout_id:{ type: types.INTEGER },
    }
  }
}