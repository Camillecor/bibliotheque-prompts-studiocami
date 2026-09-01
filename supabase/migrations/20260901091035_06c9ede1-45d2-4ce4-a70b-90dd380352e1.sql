CREATE POLICY "Users can manage their own media files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'medias' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'medias' AND (storage.foldername(name))[1] = auth.uid()::text);