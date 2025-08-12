import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '../database/setup';

export default function DatabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SQLiteProvider
      databaseName="gymlogger.db"
      onInit={initializeDatabase}
      options={{ useNewConnection: false }}
    >
      {children}
    </SQLiteProvider>
  );
}
