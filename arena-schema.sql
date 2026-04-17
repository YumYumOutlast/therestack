-- Pass 9: Arena XP challenge completions
-- Run once in the Supabase SQL editor.

create table if not exists arena_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id text not null,
  xp_earned integer not null,
  completed_at timestamptz not null default now(),
  verified boolean not null default false,
  unique (user_id, challenge_id)
);

create index if not exists arena_completions_user_idx
  on arena_completions (user_id);

alter table arena_completions enable row level security;

create policy "arena_completions_select_own"
  on arena_completions for select
  using (auth.uid() = user_id);

create policy "arena_completions_insert_own"
  on arena_completions for insert
  with check (auth.uid() = user_id);

create policy "arena_completions_delete_own"
  on arena_completions for delete
  using (auth.uid() = user_id);
