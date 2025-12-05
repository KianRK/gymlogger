import { DateMetrics } from './Interfaces';
import { Measurements } from './Interfaces';

export type DateDictionary = Record<string, DateMetrics>;

export type MetricsDictionary = Record<keyof Measurements, string>;
