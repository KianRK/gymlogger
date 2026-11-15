import { SQLiteDatabase } from 'expo-sqlite';
import { exercises } from './seed/exercises';

export function seedExercises(db: SQLiteDatabase) {
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises'
  );
  if (result && result.count > 0) return;

  db.withTransactionSync(() => {
    const stmt = db.prepareSync(
      'INSERT INTO exercises (name, primary_target, secondary_target, region) VALUES (?, ?, ?, ?)'
    );
    try {
      for (const e of exercises) {
        stmt.executeSync(
          e.name,
          JSON.stringify(e.primary_target),
          e.secondary_target ? JSON.stringify(e.secondary_target) : null,
          e.region
        );
      }
    } finally {
      stmt.finalizeSync();
    }
  });
}
