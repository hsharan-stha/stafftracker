export class GeozoneModel {
    constructor(
        public geozone_name: string,
        public geozone_address: string,
        public geozone_radius: string,
        public geozone_color: string,
        public long: number,
        public lat: number
        ){}
	
}

export class GeozoneTblModel{
    constructor(
        public id: number,
        public name: string,
        public address: string,
        public radius: number,
        public color: string,
        public longitude: number,
        public latitude: number        
    ){}
}
