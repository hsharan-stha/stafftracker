export class EmployeeModel {
    constructor(
        public msisdn: string,
	public email: string,
	public name: string,
	public group_id: number,
        public position_id: number,
        public icon_url: any,
        public description: string,
        public role_id: number,
        public password: string
        ){}

}

export class EmployeeTblModel{
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public position: string,
        public position_id: number,
        public icon_url: string,
        public group: string,
        public group_id: number,
        public group_icon_url: string,
        public msisdn: string,
        public last_location_status: string,
        public last_location : Date,
        public description: string,
        public rejected_tracking: string,
    ){}
}
