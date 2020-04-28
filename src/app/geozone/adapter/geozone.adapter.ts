import {Adapter} from "../../core/adapter";
import {Injectable} from "@angular/core";
import {GeozoneModel, GeozoneTblModel} from "../model/geozone.model";


@Injectable()

export class GeozoneAdapter implements Adapter<GeozoneModel> {

    adapt(data: any): GeozoneModel {
        return new GeozoneModel(
            data.geozone_name,
            data.geozone_address,
            data.geozone_radius,
            data.geozone_color,
            data.long,
            data.lat
        );
    }

}


export class GeozoneTblAdapter implements Adapter<GeozoneTblModel> {
    adapt(data: any): GeozoneTblModel {
        return new GeozoneTblModel(
            data.id,
            data.name,
            data.address,
            data.radius,
            data.color,
            data.longitude,
            data.latitude            
        );
    }
}
