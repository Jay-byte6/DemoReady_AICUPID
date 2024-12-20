-- Check if tables exist and create them if they don't
DO $$ 
BEGIN
    -- Create smart_matches table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'smart_matches') THEN
        CREATE TABLE public.smart_matches (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            compatibility_score FLOAT NOT NULL,
            strengths TEXT[] DEFAULT '{}',
            challenges TEXT[] DEFAULT '{}',
            tips TEXT[] DEFAULT '{}',
            long_term_prediction TEXT,
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            UNIQUE(user_id, target_user_id)
        );

        -- Enable RLS for smart_matches
        ALTER TABLE public.smart_matches ENABLE ROW LEVEL SECURITY;

        -- Create policies for smart_matches
        CREATE POLICY "Users can view their own smart matches"
            ON public.smart_matches
            FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can manage their own smart matches"
            ON public.smart_matches
            FOR ALL
            USING (auth.uid() = user_id);

        -- Create indexes for smart_matches
        CREATE INDEX IF NOT EXISTS smart_matches_user_id_idx ON public.smart_matches(user_id);
        CREATE INDEX IF NOT EXISTS smart_matches_target_user_id_idx ON public.smart_matches(target_user_id);
    END IF;

    -- Create favorite_profiles table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'favorite_profiles') THEN
        CREATE TABLE public.favorite_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            favorite_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            UNIQUE(user_id, favorite_user_id)
        );

        -- Enable RLS for favorite_profiles
        ALTER TABLE public.favorite_profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies for favorite_profiles
        CREATE POLICY "Users can view their own favorite profiles"
            ON public.favorite_profiles
            FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can manage their own favorite profiles"
            ON public.favorite_profiles
            FOR ALL
            USING (auth.uid() = user_id);

        -- Create indexes for favorite_profiles
        CREATE INDEX IF NOT EXISTS favorite_profiles_user_id_idx ON public.favorite_profiles(user_id);
        CREATE INDEX IF NOT EXISTS favorite_profiles_favorite_user_id_idx ON public.favorite_profiles(favorite_user_id);
    END IF;

    -- Ensure RLS is enabled for both tables (in case they already existed)
    ALTER TABLE public.smart_matches ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.favorite_profiles ENABLE ROW LEVEL SECURITY;

    -- Create or update policies (will not throw errors if they exist)
    DO $policies$
    BEGIN
        -- Drop and recreate policies for smart_matches if they don't exist
        IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'smart_matches' AND policyname = 'Users can view their own smart matches') THEN
            CREATE POLICY "Users can view their own smart matches"
                ON public.smart_matches
                FOR SELECT
                USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'smart_matches' AND policyname = 'Users can manage their own smart matches') THEN
            CREATE POLICY "Users can manage their own smart matches"
                ON public.smart_matches
                FOR ALL
                USING (auth.uid() = user_id);
        END IF;

        -- Drop and recreate policies for favorite_profiles if they don't exist
        IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'favorite_profiles' AND policyname = 'Users can view their own favorite profiles') THEN
            CREATE POLICY "Users can view their own favorite profiles"
                ON public.favorite_profiles
                FOR SELECT
                USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'favorite_profiles' AND policyname = 'Users can manage their own favorite profiles') THEN
            CREATE POLICY "Users can manage their own favorite profiles"
                ON public.favorite_profiles
                FOR ALL
                USING (auth.uid() = user_id);
        END IF;
    END
    $policies$;

END
$$; 