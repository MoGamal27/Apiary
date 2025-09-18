export interface IHive {
  apiary_id: number;
  status?: string;
  hive_identifier?: string;
  color?: string;
  type?: string;
  source?: string;
  purpose?: string;
  created_date?: Date | string;
  note?: string | null;
  colony_info?: {
    strength?: number;
    strength_category?: string;
    temperament?: string;
    supers_count?: number;
    frames_count?: number;
  };
  queen_info?: {
    has_queen?: boolean;
    queen_status?: string;
    queen_id?: string;
    queen_hatched_year?: number;
    queen_installed_date?: Date | string;
    queen_state?: string;
    queen_race?: string;
    queen_clipped?: boolean;
    queen_marked?: boolean;
    queen_note?: string;
    queen_origin?: string;
  };
}