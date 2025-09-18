export interface ITreatment {
  scope?: string;
  apiary_id?: number;
  apply_to_all_hives?: boolean;
  hive_id?: number;
  name?: string;
  disease?: string;
  treatment_product?: string;
  start_date?: string;
  end_date?: string;
  input_as?: string;
  total_quantity?: number;
  doses?: string;
  notes?: string;
}