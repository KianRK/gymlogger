import { SQLiteDatabase } from 'expo-sqlite';
import { seedExercises } from './seed';

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        primary_target TEXT NOT NULL,
        secondary_target TEXT,
        region TEXT NOT NULL,
        is_favorite INTEGER DEFAULT 0,
        is_default INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS template_workouts (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS template_exercises (
        id INTEGER PRIMARY KEY,
        template_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        order_index INTEGER,
        FOREIGN KEY (template_id) REFERENCES template_workouts(id) ON DELETE CASCADE,
        UNIQUE(template_id, order_index)
      );

      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        order_index INTEGER,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
        UNIQUE(workout_id, order_index)
      );

      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY,
        exercise_id INTEGER NOT NULL,
        order_index INTEGER,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY (exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE,
        UNIQUE(exercise_id, order_index)
      );

      CREATE TABLE IF NOT EXISTS template_sets (
        id INTEGER PRIMARY KEY,
        exercise_id INTEGER NOT NULL,
        order_index INTEGER,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY (exercise_id) REFERENCES template_exercises(id) ON DELETE CASCADE,
        UNIQUE(exercise_id, order_index)
      );
    `);

    seedExercises(db);

    console.log('DB init complete.');
  } catch (error) {
    console.error('Database init failed:', error);
  }
}
