-- Seder (order of operations) uses the existing shared table public.kefel_state
-- (same as kefel/hiluk/hisur). Row id: 'emilia-seder'. data = {hist:[sessions...], last:[keys]}
-- Each session: {id,date,n,ok,first,miss,help,items:[{type,expr,correct,expected_input,entries[],tries,ms_to_correct,total_ms,outcome}]}
-- Only needed if anon upsert of new ids is not allowed by your RLS policy:
insert into public.kefel_state (id, data)
values ('emilia-seder', jsonb_build_object('hist','[]'::jsonb,'last','[]'::jsonb))
on conflict (id) do nothing;
