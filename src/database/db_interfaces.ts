export interface Exercise {
  id: number;
  name: string;
  primary_target: Array<string>;
  secondary_target: Array<string>;
  region: string;
  favorite: number;
}

export interface Workout {
  id: number;
  date: string;
  notes: string;
}

export interface WorkoutExercise {
  id: number;
  workout_id: number;
  name: string;
  date: string;
  order_index: number;
}

export interface Set {
  id: number;
  exercise_id: number;
  order_index: number;
  reps: number;
  weight: number;
}
