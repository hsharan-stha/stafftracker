
export class TimeTrackingCsvModel {
  constructor(
      public title: string,
      public position: string,
      public group: string,
      public hours_worked: string,
      public absent_time: string,
      public lateness: string,
      public summary: string,
      public has_violation : number
  ) {
  }

}
