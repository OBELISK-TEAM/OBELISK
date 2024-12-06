export interface AggregationRule {
  maxMinutes: number;
  intervalInMinutes: number;
  incrementDate: (date: Date) => Date;
}
