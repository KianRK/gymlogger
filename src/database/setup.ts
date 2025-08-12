import { db } from './index';
import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    db.execSync(
      `
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      `
    );
    db.execSync(
      `
      CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      target TEXT NOT NULL
      );
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('lat pulldown', 'back');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('incline bench press', 'chest');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('cable flys', 'chest');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('lat prayer', 'back');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('bayesian cable curls', 'biceps');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('decline bench press', 'chest');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('preacher biceps curls', 'biceps');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('cable kickbacks', 'triceps');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('bench press', 'chest');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('leg extensions', 'legs');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('standing calves', 'legs');
      INSERT OR IGNORE INTO exercises (name, target) VALUES ('cable crunches', 'abs');
      `
    );
    db.execSync(
      `
      CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      notes TEXT
      );
      `
    );
    db.execSync(
      `
      CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
      );
      `
    );
    db.execSync(
      `
      CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY,
      exercise_id INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercise(id) ON DELETE CASCADE
      );
      `
    );
    console.log('DB init complete.');
  } catch (error) {
    console.error('Database init failed:', error);
  }
}
