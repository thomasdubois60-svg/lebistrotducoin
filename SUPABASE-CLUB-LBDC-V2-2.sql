-- À exécuter une seule fois dans Supabase > SQL Editor avant de tester la V2.2.
alter table public.club_members add column if not exists last_name text;
alter table public.club_members add column if not exists password_hash text;
alter table public.club_members add column if not exists password_salt text;
update public.club_members set last_name = 'À compléter' where last_name is null or trim(last_name) = '';
-- Les anciens comptes sans mot de passe peuvent être remis à jour en remplissant à nouveau le formulaire d’inscription avec la même adresse e-mail.
