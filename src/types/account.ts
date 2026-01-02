// Shared Account type definition

export interface Account {
  id: string;
  company_name: string;
  region?: string | null;
  country?: string | null;
  website?: string | null;
  company_type?: string | null;
  tags?: string[] | null;
  status?: string | null;
  notes?: string | null;
  account_owner?: string | null;
  industry?: string | null;
  phone?: string | null;
  email?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  modified_by?: string | null;
  score?: number | null;
  segment?: string | null;
  total_revenue?: number | null;
  deal_count?: number | null;
  contact_count?: number | null;
  // Enterprise fields
  annual_revenue?: number | null;
  employee_count?: number | null;
  parent_account_id?: string | null;
  account_tier?: string | null;
  billing_city?: string | null;
  billing_country?: string | null;
  last_activity_date?: string | null;
}

export interface AccountFormData {
  company_name: string;
  email?: string;
  region?: string;
  country?: string;
  website?: string;
  company_type?: string;
  status?: string;
  notes?: string;
  industry?: string;
  phone?: string;
  segment?: string;
  annual_revenue?: number;
  employee_count?: number;
  parent_account_id?: string;
  account_tier?: string;
  billing_city?: string;
  billing_country?: string;
}
