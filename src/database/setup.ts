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
      primary_target TEXT NOT NULL,
      secondary_target TEXT,
      region TEXT NOT NULL
      );
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lat Pulldown', 'Lats', '["Biceps"]', 'Back');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Incline Bench Press', 'Chest', '["Triceps", "Front Deltoid"]', 'Chest');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Fly', 'Chest', '["Front Deltoid"]', 'Chest');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lat Prayer', 'Lats', '["Posterior Deltoid", "Triceps"]', 'Back');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bayesian Cable Curl', 'Biceps', '["Forearm Flexor"]', 'Biceps');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Decline Bench Press', 'Chest', '["Triceps", "Front Deltoid"]', 'Chest');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Preacher Curl', 'Biceps', '["Forearm Flexor"]', 'Biceps');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bench Press', 'Chest', '["Front Deltoid", "Triceps"]', 'Chest');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Leg Extensions', 'Quads', NULL, 'Legs');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Calf Raise', 'Calves', NULL, 'Legs');
      INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Crunch', 'Abs', '["Obliques"]', 'Abs');
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
      date TEXT NOT NULL,
      order_index INTEGER,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
      UNIQUE(workout_id, order_index)
      );
      `
    );
    db.execSync(
      `
      CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY,
      exercise_id INTEGER NOT NULL,
      order_index INTEGER,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE,
      UNIQUE(exercise_id, order_index)
      );
      `
    );
    console.log('DB init complete.');
  } catch (error) {
    console.error('Database init failed:', error);
  }
}
