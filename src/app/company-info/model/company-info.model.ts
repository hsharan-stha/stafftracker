export class CompanyInfoModel {
    constructor(
        public id: number,
        public name: string,
        public msisdn: string,
	public email: string,
        public icon_url: any
        ){
        }
	
}

export class CompanyInfoFormModel {
    protected formData;
    constructor(
        public id: number,
        public name: string,
        public msisdn: string,
	public email: string,
        public image: any
        ){
            this.formData = new FormData();
            if (id) {
                this.formData.append('id', id);
            }
            this.formData.append('company_name', name);
            this.formData.append('msisdn', msisdn);
            this.formData.append('email', email);
            
            if (image) {
                this.formData.append('image', image);
            }
            
            return this.formData;    
        
        }
	
}

