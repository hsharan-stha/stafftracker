export class ExtraParams {
  constructor(
    public id: string,
    public msisdn: string,
    public limit: string,
    public page_number: string,
    public order_by: string,
    public order_direction: string,
    public filters: any
  ) {
  }
}
