export interface ITask {
  status?: string;
  type?: string;
  apiary_id?: number;
  hive_id?: number;
  priority?: string;
  title?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  description?: string;
  reminder?: boolean;
  reminder_me?: string;
}
