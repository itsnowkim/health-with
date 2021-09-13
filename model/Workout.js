import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Workout extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('upgradeDB.db')
  }

  static get tableName() {
    return 'workout'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      date: { type: types.TEXT, not_null: true },
    }
  }
}