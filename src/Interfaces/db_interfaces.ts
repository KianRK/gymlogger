export interface Exercise {
  id: number;
  name: string;
  primary_target: string;
  secondary_target: string;
  region: string;
  favorite: number;
}

export interface ExerciseParsed {
  id: number;
  name: string;
  primary_target: string[];
  secondary_target: string[];
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

export interface Template {
  id: number;
  name: string;
  notes: string;
}

export interface TemplateExercise {
  id: number;
  template_id: number;
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
