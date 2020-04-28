import { Adapter } from 'src/app/core/adapter';

export class NotificationAndExplanatoryAdapter implements Adapter<NotificationAndExplanatoryModel> {
    adapt(data: any): NotificationAndExplanatoryModel {
        return new NotificationAndExplanatoryModel(
            data.name,
            data.position,
            data.group,
            data.position,
            data.text,
            data.datetime,
            data.datetime,
            data.direction,
            data.critical_level
        );
    }

}

export class NotificationAndExplanatoryModel {
    constructor(
        public name: string,
        public position: string,
        public groupname: string,
        public groupposition: string,
        public message: string,
        public date: string,
        public time: string,
        public direction: number,
        public critical: number
    ) {
    }

}

export class NotificationAndExplanatoryCsVModel {
    constructor(
        public title: string,
        public position: string,
        public groupname: string,
        public groupposition: string,
        public message: string,
        public date: string,
        public time: string,
        public direction: number,
        public critical: number
    ) {
    }

}
