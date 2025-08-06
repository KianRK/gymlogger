import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="gymlogger.db"
      onInit={async (db) => {
        try {
          await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS exercises (
              id INTEGER PRIMARY KEY NOT NULL,
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
          `);
          console.log('DB init complete.');
        } catch (error) {
          console.error('Database init failed:', error);
        }
      }}
      options={{ useNewConnection: false }}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </SQLiteProvider>
  );
}
