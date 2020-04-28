import { Adapter } from 'src/app/core/adapter';

// export class EmployeeDataCsvAdapter implements Adapter<EmployeeDataCsvModel> {
//     adapt(data: any): EmployeeDataCsvModel {
//         console.log(data);
//         return new EmployeeDataCsvModel(
//             data.name,
//             data.position,
//             data.group,
//             data.position,
//             data.text,
//             data.date,
//             '',
//             ''
//         );
//     }

// }

export class EmployeeDataCsvModel {
    constructor(
        public title: string,
        public days_without_violations: string,
        public violation_at_working_schedule: string,
        public number_of_delay: string,
        public absence_at_end_of_work: string,
        public working_hours: string,
        public date: string,
        public worked_hrs: number,
        public overwork: number,
        public not_completed: number
    ) {
    }

}
