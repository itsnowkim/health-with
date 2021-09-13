import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Workout_Session_Tag extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('upgradeDB.db')
  }

  static get tableName() {
    return 'workout_session_tag'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      workout_id: { type: types.INTEGER },
      session_id: { type: types.INTEGER },
      tag_id: { type: types.INTEGER },
    }
  }
}