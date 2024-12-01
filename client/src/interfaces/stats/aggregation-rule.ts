export interface AggregationRule {
  maxDays: number;
  intervalInMinutes: number;
  incrementDate: (date: Date) => Date;
}
