insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);

create policy "Portfolio images are public"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "Admins can upload portfolio images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update portfolio images"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete portfolio images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'));