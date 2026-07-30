export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}
