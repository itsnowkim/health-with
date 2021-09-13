import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Set extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('upgradeDB.db')
  }

  static get tableName() {
    return 'sets'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      weight: { type: types.FLOAT },
      rep: { type: types.INTEGER },
      time: { type: types.INTEGER },
      lb: { type: types.INTEGER },
    }
  }
}