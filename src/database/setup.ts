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
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Assisted Dip', '["Chest", "Front Deltoid", "Triceps"]', NULL, 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Band-Assisted Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bar Dip', '["Chest", "Front Deltoid", "Triceps"]', NULL, 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Board Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Chest Press', '["Chest"]', '["Front Deltoid", "Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Clap Push-Up', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Close-Grip Bench Press', '["Triceps"]', '["Chest", "Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Close-Grip Feet-Up Bench Press', '["Triceps"]', '["Chest", "Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cobra Push-Up', '["Chest", "Triceps"]', '["Abs", "Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Decline Bench Press', '["Chest"]', '["Triceps", "Front Deltoid "]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Decline Push-Up', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Chest Fly', '["Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Chest Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Decline Chest Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Floor Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Pullover', '["Chest"]', '["Lats"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Feet-Up Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Floor Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Incline Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Incline Dumbbell Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Incline Push-Up', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Floor Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kneeling Incline Push-Up', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kneeling Push-Up', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Chest Fly', '["Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Chest Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pec Deck', '["Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pin Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plank to Push-Up', '["Abs", "Chest", "Front Deltoids", "Triceps"]', '["Obliques"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Push-Up', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Push-Up Against Wall', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Push-Ups With Feet in Rings', '["Chest", "Front Deltoid"]', '["Triceps", "Abs"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Ring Dip', '["Triceps", "Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Cable Chest Fly', '["Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Incline Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Reverse Grip Bench Press', '["Chest", "Front Deltoid"]', '["Triceps"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Cable Chest Fly', '["Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Resistance Band Chest Fly', '["Chest"]', '["Front Deltoid"]', 'Chest');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Arnold Press', '["Front Deltoid"]', '["Lateral Deltoid", "Triceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Band External Shoulder Rotation', '["Rotator Cuff (posterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Band Internal Shoulder Rotation', '["Rotator Cuff (anterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Band Pull-Apart', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Banded Face Pull', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Front Raise', '["Front Deltoid"]', '["Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Rear Delt Row', '["Rear Deltoid", "Trapezius"]', '["Rotator Cuff", "Biceps", "Forearm Flexors"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Upright Row', '["Lateral Deltoid"]', '["Front Deltoid", "Trapezius", "Biceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Behind the Neck Press', '["Front Deltoid", "Lateral Deltoid"]', '["Trapezius", "Triceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Internal Shoulder Rotation', '["Rotator Cuff (anterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Front Raise', '["Front Deltoid"]', '["Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Lateral Raise', '["Lateral Deltoid"]', '["Front Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Rear Delt Row', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius", "Biceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cuban Press', '["Front Deltoid"]', '["Lateral Deltoid", "Read Deltoid", "Trapezius", "Triceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Devils Press', '["Front Deltoid", "Chest", "Quads", "Adductors"]', '["Forearm Flexors", "Calves", "Abs", "Trapezius", "Triceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Front Raise', '["Front Deltoid"]', '["Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Horizontal Internal Shoulder Rotation', '["Rotator Cuff (anterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Horizontal External Shoulder Rotation', '["Rotator Cuff (posterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Lateral Raise', '["Lateral Deltoid"]', '["Front Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Rear Delt Row', '["Rear Deltoid", "Trapezius"]', '["Rotator Cuff", "Biceps", "Forearm Flexors"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Shoulder Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Face Pull', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Front Hold', '["Front Deltoid"]', '["Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Handstand Push-Up', '["Front Deltoid"]', '["Lateral Deltoid", "Triceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Jerk', '["Front Deltoid"]', '["Quads", "Glutes", "Adductors", "Lower Back", "Trapezius", "Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Halo', '["Front Deltoid", "Lateral Deltoid", "Read Deltoid"]', '["Trapezius", "Triceps", "Abs", "Obliques"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Push Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Landmine Press', '["Front Deltoid"]', '["Triceps", "Chest"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lying Dumbbell External Shoulder Rotation', '["Rotator Cuff (posterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lying Dumbbell Internal Shoulder Rotation', '["Rotator Cuff (anterior)"]', NULL, 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Lateral Raise', '["Lateral Deltoid"]', '["Front Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Shoulder Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Monkey Row', '["Lateral Deltoid"]', '["Rear Deltoid", "Trapezius", "Biceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Arm Landmine Press', '["Front Deltoid"]', '["Triceps", "Chest"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Overhead Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plate Front Raise', '["Front Deltoid"]', '["Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Poliquin Raise', '["Lateral Deltoid"]', '["Front Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Power Jerk', '["Front Deltoid"]', '["Quads", "Glutes", "Adductors", "Lower Back", "Trapezius", "Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Push Press', '["Front Deltoid"]', '["Quads", "Glutes", "Adductors", "Lower Back", "Trapezius", "Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Resistance Band Lateral Raise', '["Lateral Deltoid"]', '["Front Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Cable Flyes', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Dumbbell Flyes', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Machine Fly', '["Rear Deltoid", "Rotator Cuff"]', '["Trapezius"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Dumbbell Shoulder Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Barbell Overhead Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Kettlebell Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Smith Machine Shoulder Press', '["Front Deltoid"]', '["Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Landmine Press', '["Front Deltoid"]', '["Triceps", "Chest"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Snatch Grip Behind the Neck Press', '["Front Deltoid", "Lateral Deltoid"]', '["Trapezius", "Triceps"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Squat Jerk', '["Glutes", "Lower Back", "Adductors", "Quads", "Front Deltoid"]', '["Trapezius", "Triceps", "Lateral Deltoid", "Calves"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Split Jerk', '["Front Deltoid"]', '["Quads", "Glutes", "Adductors", "Lower Back", "Trapezius", "Triceps", "Lateral Deltoid"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Wall Walk', '["Front Deltoid"]', '["Triceps", "Chest", "Abs"]', 'Shoulder');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Preacher Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bayesian Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bodyweight Curl', '["Biceps", "Lats"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Crossover Bicep Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Curl With Bar', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Curl With Rope', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Concentration Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Drag Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Preacher Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hammer Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Incline Dumbbell Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Bicep Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Resistance Band Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Zottman Curl', '["Biceps"]', '["Forearm Flexors"]', 'Biceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Standing Triceps Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Incline Triceps Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Lying Triceps Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bench Dip', '["Triceps"]', '["Chest", "Front Deltoid"]', 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Crossbody Cable Triceps Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Close-Grip Push-Up', '["Triceps"]', '["Abs", "Chest", "Front Deltoid"]', 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Standing Triceps Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Overhead Cable Triceps Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Tricep Bodyweight Extension', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Tricep Pushdown With Bar', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Tricep Pushdown With Rope', '["Triceps"]', NULL, 'Triceps');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Air Squat', '["Quads", "Glutes", "Adductors"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Banded Hip March', '["Hip Flexor"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Hack Squat', '["Quads"]', '["Glutes", "Adductors", "Lower Back", "Trapezius", "Forearm Flexors", "Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Walking Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Belt Squat', '["Quads", "Glutes", "Adductors"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Body Weight Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bodyweight Leg Curl', '["Hamstrings"]', '["Glutes"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Box Jump', '["Hip Flexors", "Quads", "Glutes", "Adductors"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Box Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bulgarian Split Squat', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Machine Hip Adduction', '["Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Chair Squat', '["Quads", "Glutes", "Adductors"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Curtsy Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Lunge', '["Quads", "Glutes", "Adductors"]', '["Forearm Flexors"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Walking Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Front Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Glute Ham Raise', '["Hamstrings"]', '["Glutes", "Lower Back"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Goblet Squat', '["Quads", "Glutes", "Adductors"]', '["Lower Back", "Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Ground to Overhead', '["Adductors", "Front Deltoids", "Glutes", "Lower Back", "Quads"]', '["Calves", "Forearm Flexors", "Hamstrings", "Lateral Deltoids", "Trapezius", "Triceps"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hack Squat Machine', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Half Air Squat', '["Quads", "Glutes", "Adductors"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Adduction Against Band', '["Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Adduction Machine', '["Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Jump Squat', '["Quads", "Glutes", "Adductors"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Jumping Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Front Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Thrusters', '["Glutes", "Adductors", "Quads", "Front Delts"]', '["Hamstrings", "Lower Back", "Calves", "Triceps", "Lateral Delts"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Landmine Hack Squat', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Landmine Squat', '["Quads", "Glutes", "Adductors"]', '[null, "Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lateral Bound', '["Quads", "Calves", "Glutes"]', '["Abductors", "Adductors"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Leg Curl On Ball', '["Hamstrings"]', '["Glutes"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Leg Extension', '["Quads"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Leg Press', '["Quads", "Glutes", "Adductors"]', '["Hamstrings"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lying Leg Curl', '["Hamstrings"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Nordic Hamstring Eccentric', '["Hamstrings"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Legged Leg Extension', '["Quads"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Legged Lying Leg Curl', '["Hamstrings"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Legged Seated Leg Curl', '["Hamstrings"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pause Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pin Squat', '["Quads", "Glutes", "Adductors", "Lower back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pistol Squat', '["Quads", "Glutes"]', '["Hamstrings"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Poliquin Step-Up', '["Quads"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Prisoner Get Up', '["Quads", "Glutes"]', '["Abs", "Obliques", "Adductors"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Barbell Lunge', '["Adductors", "Quads", "Glutes"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Body Weight Lunge', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Dumbbell Lunge', '["Quads", "Glutes", "Adductors"]', '["Forearm Flexors"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Nordic', '["Quads"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Romanian Deadlift', '["Glutes", "Lower Back", "Hamstrings"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Safety Bar Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Leg Curl', '["Hamstrings"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Shallow Body Weight Lunge', '["Quads", "Glutes", "Adductors"]', '["Hamstrings"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Bulgarian Split Squat', '["Quads", "Glutes", "Adductors"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Front Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Sumo Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Squat', '[null, null, null, null]', '[null]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Cable Leg Extension', '["Quads"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Hip Flexor Raise', '["Hip Flexor"]', NULL, 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Zercher Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Zombie Squat', '["Quads", "Glutes", "Adductors", "Lower Back"]', '["Calves"]', 'Leg');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Assisted Chin-Up', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Assisted Pull-Up', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Back Extension', '["Glutes", "Lower Back"]', '["Hamstrings"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Banded Muscle-Up', '["Chest", "Lats", "Triceps"]', '["Biceps", "Forearm Flexors", "Front Deltoid", "Rear Deltoids", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Lower Back", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Shrug', '["Trapezius"]', '["Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Block Clean', '["Glutes", "Lower Back", "Adductors", "Quads"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Calves"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Block Snatch', '["Glutes", "Lower Back", "Adductors", "Quads"]', '["Hamstrings", "Trapezius", "Calves", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Close Grip Seated Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Wide Grip Seated Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Chest to Bar', '["Lats"]', '["Rear Deltoids", "Biceps", "Rotator Cuff", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Chin-Up', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Clean', '["Glutes", "Lower Back", "Adductors", "Quads"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Calves"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Clean and Jerk', '["Glutes", "Lower Back", "Adductors", "Quads", "Front Deltoid"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Triceps", "Lateral Deltoid", "Calves"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Close-Grip Chin-Up', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Close-Grip Lat Pulldown', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Deadlift', '["Glutes", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Deficit Deadlift', '["Glutes", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Deadlift', '["Glutes", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Shrug', '["Trapezius"]', '["Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Floor Back Extension', '["Lower Back"]', NULL, 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Good Morning', '["Glutes", "Lower Back", "Hamstrings"]', '["Adductors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Gorilla Row', '["Lats", "Trapezius", "Rotator Cuff"]', '["Biceps", "Forearm Flexors", "Rear Deltoids"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hang Clean', '["Glutes", "Lower Back", "Adductors", "Quads"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Calves"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hang Power Clean', '["Glutes", "Lower Back"]', '["Adductors", "Hamstrings", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hang Power Snatch', '["Glutes", "Lower Back"]', '["Adductors", "Hamstrings", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hang Snatch', '["Glutes", "Lower Back", "Adductors", "Quads"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Calves"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Inverted Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Inverted Row with Underhand Grip', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Jefferson Curl', '["Lower Back"]', '["Adductors", "Glutes", "Hamstrings", "Trapezius"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Jumping Muscle-Up', '["Chest", "Lats", "Triceps"]', '["Biceps", "Forearm Flexors", "Front Deltoid", "Rear Deltoids", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Clean', '["Glutes", "Lower Back"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Adductors", "Obliques"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Clean & Jerk', '["Glutes", "Lower Back", "Front Deltoid"]', '["Hamstrings", "Adductors", "Trapezius", "Forearm Flexors", "Triceps", "Lateral Deltoid"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Clean & Press', '["Glutes", "Lower Back", "Front Deltoid"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Triceps", "Lateral Deltoid", "Adductors", "Obliques"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Snatch', '["Glutes", "Lower Back"]', '["Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Swing', '["Glutes", "Lower Back"]', '["Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kroc Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Lower Back", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lat Pulldown Neutral Grip', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lat Pulldown Pronated Grip', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lat Pulldown Supinated Grip', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Lat Pulldown', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Muscle-Up (Bar)', '["Chest", "Lats", "Triceps"]', '["Biceps", "Forearm Flexors", "Front Deltoid", "Rear Deltoids", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Muscle-Up (Rings)', '["Chest", "Lats", "Triceps"]', '["Biceps", "Forearm Flexors", "Front Deltoid", "Rear Deltoids", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Neutral Close-Grip Lat Pulldown', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Handed Cable Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Handed Kettlebell Swing', '["Glutes", "Lower Back"]', '["Hamstrings", "Adductors", "Trapezius", "Forearm Flexors", "Obliques"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Handed Lat Pulldown', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pause Deadlift', '["Glutes", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Power Clean', '["Glutes", "Lower Back"]', '["Quads", "Adductors", "Hamstrings", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Power Snatch', '["Glutes", "Lower Back"]', '["Quads", "Adductors", "Hamstrings", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pull-Up', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Pull-Up With a Neutral Grip', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Rack Pull', '["Glutes", "Lower Back"]', '["Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Renegade Row', '["Lats", "Trapezius", "Rear Deltoids", "Rotator Cuff"]', '["Biceps", "Forearm Flexors", "Abs", "Obliques"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Ring Pull-Up', '["Lats"]', '["Biceps", "Rear Deltoids", "Forearm Flexors", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Ring Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Scap Pull-Up', '["Rotator Cuff", "Forearm Flexors"]', NULL, 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Machine Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Single Leg Deadlift with Kettlebell', '["Glutes", "Hamstrings", "Lower Back"]', '["Abductors", "Adductors", "Forearm Flexors", "Trapezius"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine One-Handed Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Snatch', '["Glutes", "Lower Back", "Adductors", "Quads"]', '["Hamstrings", "Trapezius", "Forearm Flexors", "Calves"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Snatch Grip Deadlift', '["Glutes", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Stiff-Legged Deadlift', '["Glutes", "Lower Back", "Hamstrings"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Straight Arm Lat Pulldown', '["Lats"]', '["Rear Deltoids", "Rotator Cuffs"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Sumo Deadlift', '["Glutes", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Superman Raise', '["Glutes", "Lower Back"]', '["Hamstrings"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('T-Bar Row', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps", "Lower Back", "Forearm Flexors", "Rotator Cuff"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Towel Row ', '["Lats", "Trapezius", "Rear Deltoids"]', '["Biceps"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Trap Bar Deadlift With High Handles', '["Glutes", "Lower Back", "Quads"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Trap Bar Deadlift With Low Handles', '["Glutes", "Lower Back", "Quads"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Back');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Banded Side Kicks', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Pull Through', '["Glutes"]', '["Lower Back", "Hamstrings", "Adductors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Machine Hip Abduction', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Clamshells', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cossack Squat', '["Hip Flexors", "Glutes", "Quads"]', '["Hamstrings", "Adductors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Death March with Dumbbells', '["Glutes", "Hamstrings", "Lower Back"]', '["Adductors", "Forearm Flexors", "Trapezius"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Donkey Kicks', '["Glutes"]', '["Hamstrings", "Adductors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Romanian Deadlift', '["Glutes", "Lower Back", "Hamstrings"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Frog Pumps', '["Glutes"]', '["Hamstrings", "Adductors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Frog Pumps', '["Glutes"]', '["Hamstrings", "Adductors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Glute Bridge', '["Glutes"]', '["Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Abduction Against Band', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Abduction Machine', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Thrust', '["Glutes"]', '["Adductors", "Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Thrust Machine', '["Glutes"]', '["Adductors", "Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hip Thrust With Band Around Knees', '["Glutes"]', '["Adductors", "Abductors", "Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Windmill', '["Glutes", "Front Deltoids", "Lateral Deltoids", "Rear Deltoids", "Hamstrings"]', '["Lower Back", "Abs", "Rotator Cuff", "Lats", "Traps"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lateral Walk With Band', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Legged Glute Bridge', '["Glutes"]', '["Adductors", "Abductors", "Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Legged Hip Thrust ', '["Glutes"]', '["Adductors", "Abductors", "Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Reverse Hyperextension', '["Glutes", "Hamstrings", "Lower back"]', NULL, 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Romanian Deadlift', '["Glutes", "Lower Back", "Hamstrings"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Smith Machine Hip Thrust', '["Glutes"]', '["Adductors", "Quads"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Single Leg Romanian Deadlift', '["Glutes", "Lower Back", "Hamstrings"]', '["Adductors", "Trapezius", "Forearm Flexors"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Hip Abduction Against Band', '["Abductors"]', '["Glutes"]', 'Glute');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Ball Slams', '["Lats", "Abs", "Obliques"]', '["Glutes", "Front Deltoids"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bicycle Crunch', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Cable Crunch', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Copenhagen Plank', '["Adductors"]', '["Abductors", "Abs", "Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Core Twist', '["Obliques", "Abs"]', NULL, 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Crunch', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dead Bug', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dead Bug With Dumbbells', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dragon Flag', '["Abs"]', '["Obliques", "Lats"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Side Bend', '["Obliques"]', NULL, 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hanging Knee Raise', '["Abs", "Hip Flexors"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hanging Leg Raise', '["Abs", "Hip Flexors"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hanging Sit-Up', '["Abs", "Hip Flexors"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hanging Windshield Wiper', '["Obliques", "Abs"]', '["Forearm Flexors"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('High to Low Wood Chop with Band', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('High to Low Wood Chop with Cable', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hollow Body Crunch', '["Abs", "Hip Flexor"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Hollow Hold', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Horizontal Wood Chop with Band', '["Obliques"]', NULL, 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Horizontal Wood Chop with Cable', '["Obliques"]', NULL, 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Jackknife Sit-Up', '["Abs", "Hip Flexors"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kettlebell Plank Pull Through', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kneeling Ab Wheel Roll-Out', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kneeling Plank', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Kneeling Side Plank', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Landmine Rotation', '["Obliques", "Abs"]', '["Front deltoids"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('L-Sit', '["Abs", "Hip Flexors"]', '["Chest", "Front Deltoid", "Triceps", "Obliques", "Quads"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lying Leg Raise', '["Abs", "Hip Flexors"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lying Windshield Wiper', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Lying Windshield Wiper with Bent Knees', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Machine Crunch', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Mountain Climbers', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Oblique Crunch', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Oblique Sit-Up', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plank', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plank with Leg Lifts', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plank with Shoulder Taps', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Side Plank', '["Obliques"]', '["Abs"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Sit-Up', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Weighted Plank', '["Abs"]', '["Obliques"]', 'Abs');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Standing Calf Raise', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Seated Calf Raise', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Donkey Calf Raise', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Eccentric Heel Drop', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Heel Raise', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Seated Calf Raise', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Standing Calf Raise', '["Calves"]', NULL, 'Calves');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Wrist Curl', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Barbell Wrist Curl Behind the Back', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Bar Hang', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Dumbbell Wrist Curl', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Farmers Walk', '["Forearm Flexors", "Obliques", "Glutes", "Trapezius"]', '["Quads", "Abs", "Lower Back", "Calves", "Lateral Deltoids"]', 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Fat Bar Deadlift', '["Glutes", "Forearm Flexors", "Lower Back"]', '["Quads", "Hamstrings", "Adductors", "Trapezius"]', 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Gripper', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('One-Handed Bar Hang', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plate Pinch', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Plate Wrist Curl', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
    INSERT OR IGNORE INTO exercises (name, primary_target, secondary_target, region) VALUES ('Wrist Roller', '["Forearm Flexors"]', NULL, 'Forearm Flexors & Grip');
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
