-- Power the marketplace from real creator profiles + seed demo creators.

-- Seeds aren't tied to auth users, so relax the auth FK on profiles.user_id.
alter table public.profiles drop constraint if exists profiles_user_id_fkey;
alter table public.profiles add column if not exists is_seed boolean not null default false;

-- Brands must be able to discover creators (any creator profile is readable).
drop policy if exists creators_public on public.profiles;
create policy creators_public on public.profiles for select using (role = 'creator');

-- Seed 8 demo creators (only if none seeded yet, so re-running is safe).
insert into public.profiles (user_id, role, is_seed, name, bio, tags, rate, avatar)
select * from (values
  (gen_random_uuid(),'creator',true,'Ava Bennett',      'I turn B2B product launches into LinkedIn stories that convert cold audiences into pipeline.', 'B2B SaaS, Marketing',        '€180',   '/naano/images/avatar-a.png'),
  (gen_random_uuid(),'creator',true,'Diego Martins',     'GTM operator sharing outbound, lead-gen and CRM playbooks for scaling revenue teams.',          'Sales, Growth / GTM',        '€500',   '/naano/images/avatar-b.png'),
  (gen_random_uuid(),'creator',true,'Priya Nair',        'Product marketing leader writing about positioning, messaging and demand for SaaS.',            'B2B SaaS, Marketing, AI',    '€260',   '/naano/images/avatar-c.png'),
  (gen_random_uuid(),'creator',true,'Liam O''Sullivan',  'Founder building in public — engineering, AI tooling and developer-experience deep dives.',      'Tech, AI, Developer Tools',  '€375',   '/naano/images/avatar-d.png'),
  (gen_random_uuid(),'creator',true,'Sofia Rossi',       'Helping founders build category authority through consistent, high-signal content.',             'Marketing, Growth / GTM',    '€96',    '/naano/images/avatar-e.png'),
  (gen_random_uuid(),'creator',true,'Noah Kim',          'SEO strategist showing B2B teams how to compound organic pipeline month over month.',           'SEO, B2B SaaS',              '€1,249', '/naano/images/avatar-f.png'),
  (gen_random_uuid(),'creator',true,'Maya Haddad',       'Design & productivity creator translating complex tools into clear, useful posts.',              'Design, Productivity',       '€140',   '/naano/images/avatar-g.png'),
  (gen_random_uuid(),'creator',true,'Tom Fischer',       'Cybersecurity founder turning threat trends into practical advice for CISOs and security teams.','Cybersecurity, Tech',        '€620',   '/naano/images/avatar-h.png')
) as v(user_id,role,is_seed,name,bio,tags,rate,avatar)
where not exists (select 1 from public.profiles where is_seed = true);
