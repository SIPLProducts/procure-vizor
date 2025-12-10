-- Create storage bucket for vendor documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-documents', 'vendor-documents', false);

-- Policy: Authenticated users can upload files
CREATE POLICY "Authenticated users can upload vendor documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can view files
CREATE POLICY "Authenticated users can view vendor documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can update files
CREATE POLICY "Authenticated users can update vendor documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can delete files
CREATE POLICY "Authenticated users can delete vendor documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);