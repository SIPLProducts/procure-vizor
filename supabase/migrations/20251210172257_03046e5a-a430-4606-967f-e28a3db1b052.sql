-- Create vendor status enum
CREATE TYPE public.vendor_status AS ENUM ('pending', 'documents_pending', 'approved', 'rejected', 'active', 'inactive', 'blocked');

-- Create document status enum
CREATE TYPE public.document_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- Create risk level enum
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high');

-- Vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  gst_number TEXT,
  pan_number TEXT,
  category TEXT,
  risk_level risk_level DEFAULT 'medium',
  status vendor_status DEFAULT 'pending',
  performance_score DECIMAL(3,1) DEFAULT 0,
  quality_score DECIMAL(3,1) DEFAULT 0,
  delivery_score DECIMAL(3,1) DEFAULT 0,
  sla_score DECIMAL(3,1) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Vendor invitations table
CREATE TABLE public.vendor_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_email TEXT NOT NULL,
  vendor_name TEXT,
  required_documents TEXT[] DEFAULT ARRAY['pan', 'gst', 'cancelled_cheque'],
  invitation_token TEXT NOT NULL UNIQUE,
  status vendor_status DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL
);

-- Vendor documents table
CREATE TABLE public.vendor_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_url TEXT,
  status document_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  expiry_date DATE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor bank details table
CREATE TABLE public.vendor_bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE UNIQUE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  branch_name TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor compliance table
CREATE TABLE public.vendor_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  certification_type TEXT NOT NULL,
  certification_number TEXT,
  issuing_authority TEXT,
  issue_date DATE,
  expiry_date DATE,
  document_url TEXT,
  status document_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors
CREATE POLICY "Authenticated users can view vendors" ON public.vendors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert vendors" ON public.vendors
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update vendors" ON public.vendors
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for vendor_invitations
CREATE POLICY "Authenticated users can view invitations" ON public.vendor_invitations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create invitations" ON public.vendor_invitations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update invitations" ON public.vendor_invitations
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for vendor_documents
CREATE POLICY "Authenticated users can view documents" ON public.vendor_documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage documents" ON public.vendor_documents
  FOR ALL TO authenticated USING (true);

-- RLS Policies for vendor_bank_details
CREATE POLICY "Authenticated users can view bank details" ON public.vendor_bank_details
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage bank details" ON public.vendor_bank_details
  FOR ALL TO authenticated USING (true);

-- RLS Policies for vendor_compliance
CREATE POLICY "Authenticated users can view compliance" ON public.vendor_compliance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage compliance" ON public.vendor_compliance
  FOR ALL TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_bank_details_updated_at
  BEFORE UPDATE ON public.vendor_bank_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_vendors_status ON public.vendors(status);
CREATE INDEX idx_vendors_category ON public.vendors(category);
CREATE INDEX idx_vendors_email ON public.vendors(email);
CREATE INDEX idx_vendor_invitations_email ON public.vendor_invitations(vendor_email);
CREATE INDEX idx_vendor_documents_vendor_id ON public.vendor_documents(vendor_id);