export class Group {
    constructor(
        public id: string,
        public name: string,
        public icon_url: string,
        public nr_employees: string,
        public rejected_tracking: string
    ) {
    }
}


export class GroupForm {

    protected formData;

    constructor(id, group_name, image, icon_url, employees) {
        this.formData = new FormData();
        if (id) {
            this.formData.append('id', id);
        }
        this.formData.append('group_name', group_name);
        if (icon_url) {
            this.formData.append('icon_url', icon_url);
        } else {
            this.formData.append('image', image);
        }
        this.formData.append('employees', employees);
        return this.formData;
    }

}

export class GroupEmpForm {
    constructor(
        public id: number,
        public added: number
    ) {
    }
}

export class GroupEmpDeletedForm {
    constructor(
        public id: number,
        public deleted: number
    ) {
    }
}

