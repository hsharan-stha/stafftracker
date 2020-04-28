export function calcNewCoordinate(lat1:number, lon1:number, d :number, degree:number) {
    console.log('/....................../');
    console.log(createCoord([lat1, lon1], degree, d));
    let R:number = 6371e3 //Radius of the Earth 
    //brng = 1.57 //Bearing is 90 degrees converted to radians.
    d = d; //Distance in m
    let brng:number = radians(degree);

    lat1 = radians(lat1) //Current lat point converted to radians
    lon1 = radians(lon1) //Current long point converted to radians

    let lat2:number = Math.asin(Math.sin(lat1) * Math.cos(d / R) +
        Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng))

    let lon2:number = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
        Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2))

    lat2 = degrees(lat2)
    lon2 = degrees(lon2)
    
    return {lat: lat2, lon: lon2};
}
// Converts from degrees to radians.
export function radians(degrees) {
    return degrees * Math.PI / 180;
};

export function degrees(radians) {
    return radians * 180 / Math.PI;
};

export function createCoord(coord, bearing:number, distance:number){
    distance = distance;
    let radius:number = 6371e3; //meters
    let  δ: number = distance / radius; // angular distance in radians
    let  θ: number = toRad(bearing);
    let  φ1: number = toRad(coord[0]);
    let  λ1: number = toRad(coord[1]);

    let φ2 = Math.asin(Math.sin(φ1)*Math.cos(δ) + Math.cos(φ1)*Math.sin(δ)*Math.cos(θ));

    let λ2 = λ1 + Math.atan2(Math.sin(θ)*Math.sin(δ)*Math.cos(φ1), Math.cos(δ)-Math.sin(φ1)*Math.sin(φ2));

    λ2 = (λ2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180°

    return [toDeg(φ2), toDeg(λ2)]; //[lat , lon, ]
}

export function toDeg(radians) { return radians * 180 / Math.PI; }
export function toRad(degrees) { return degrees * Math.PI / 180; }


//   