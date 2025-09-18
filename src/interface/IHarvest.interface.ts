export interface IHarvest {
  scope?: string;
  apiary_id?: number;
  apply_to_all_hives?: boolean;
  hive_id?: number;
  name?: string;
  harvest_date?: string;
  product_type?: string;
  variety?: string;
  total_quantity?: number;
  unit?: string;
  notes?: string;
}