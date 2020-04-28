import {Adapter} from "../../core/adapter";
import {Injectable} from "@angular/core";
import {CompanyInfoModel, CompanyInfoFormModel} from "../model/company-info.model";


@Injectable()

export class CompanyInfoAdapter implements Adapter<CompanyInfoModel> {
    adapt(data: any): CompanyInfoModel {
        return new CompanyInfoModel(
            data.id,
            data.name,
            data.msisdn,
            data.email,
            data.icon_url
        );
    }

}


export class CompanyInfoFormAdapter implements Adapter<CompanyInfoFormModel> {
    adapt(data: any): CompanyInfoFormModel {
        return new CompanyInfoFormModel(
            data.id,
            data.name,
            data.msisdn,
            data.email,
            data.icon_url
        );
    }

}