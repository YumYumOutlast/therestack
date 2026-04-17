-- Seed the Snape E2E test user (pre-confirmed, no email verification needed).
-- Run this in Supabase SQL Editor (requires service_role privileges).
-- Idempotent: safe to re-run; deletes any prior snape user first.
--
-- After running, tests/snape.js can sign in as:
--   email:    snape@therestack.com
--   password: TestSnape123!

DO $$
DECLARE
  snape_user_id UUID := 'a0000000-0000-4000-a000-000000000002';
  snape_email   TEXT := 'snape@therestack.com';
  snape_password TEXT := 'TestSnape123!';
BEGIN
  -- Wipe any previous snape account (cascades to identities and profile)
  DELETE FROM auth.users WHERE email = snape_email;

  -- Create the auth user with email already confirmed
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    snape_user_id,
    'authenticated',
    'authenticated',
    snape_email,
    crypt(snape_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  );

  -- Identity row (required for email sign-in on Supabase GoTrue 2.x+)
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    snape_user_id,
    snape_user_id::text,
    'email',
    jsonb_build_object(
      'sub', snape_user_id::text,
      'email', snape_email,
      'email_verified', true
    ),
    now(),
    now(),
    now()
  );

  -- Profile row (full_name null so ClaimForm's info step shows if Snape ever reaches it)
  INSERT INTO public.profiles (id)
  VALUES (snape_user_id)
  ON CONFLICT (id) DO UPDATE
    SET full_name = NULL;

  RAISE NOTICE 'Seeded Snape test user % (id %)', snape_email, snape_user_id;
END $$;
