export interface Exercise {
  id: number;
  name: string;
  target: string;
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
  order_index: number;
}

export interface Set {
  id: number;
  exercise_id: number;
  order_index: number;
  reps: number;
  weight: number;
}
