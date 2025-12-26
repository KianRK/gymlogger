export interface DateMetrics {
  volume: number;
  dailyMax: number;
  sets: number;
  reps: number;
}

export interface Measurements {
  Weight: number | null;
  BodyFat: number | null;
  Neck: number | null;
  Shoulders: number | null;
  Chest: number | null;
  RightBiceps: number | null;
  RightForearm: number | null;
  LeftBiceps: number | null;
  LeftForearm: number | null;
  Waist: number | null;
  Hip: number | null;
  RightThigh: number | null;
  RightCalf: number | null;
  LeftThigh: number | null;
  LeftCalf: number | null;
}

export interface RegionCount {
  Abs: number;
  Back: number;
  Biceps: number;
  Calves: number;
  Chest: number;
  Forearm: number;
  Legs: number;
  Shoulders: number;
  Triceps: number;
}
