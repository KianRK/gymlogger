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
