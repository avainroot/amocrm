export interface ILeads {
  id: number;
  name: string;
  price: number;
  created_at: number;
  updated_at: number;
  custom_fields_values: any[];
  _embedded: {
    leads: any[];
    contacts: any[];
    companies: any[];
  };
  _links: {
    prev: string;
    next: string;
  };
}
