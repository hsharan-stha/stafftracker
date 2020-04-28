export class GeozoneVists {
  constructor(
    public geo_name: string,
    public address: string,
    public radius: string,
    public created_date: string,
    public created_time: string,
    public name: string,
    public icon_url: string,
    public position: string,
    public event: string
  ) {
  }
}

export class GeozoneVisitsExtraParams {
  constructor(
    public geozone_id: string,
    public date_from: string,
    public date_to: string,
    public limit: string,
    public page_number: string,
    public order_by: string,
    public order_direction: string,
    public for_export: string
  ) {
  }
}
