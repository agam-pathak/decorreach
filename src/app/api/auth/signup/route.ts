import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/db/supabase';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // 1. Real Supabase Auth (when credentials exist)
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              company_name: companyName || 'Home Decor Enterprise',
            },
          },
        });
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({
          user: {
            id: data.user?.id,
            email: data.user?.email,
            name,
            companyName: companyName || 'Home Decor Enterprise',
            createdAt: data.user?.created_at,
          },
          session: data.session,
        });
      }
    }

    // 2. Local Fallback Creation
    const newUser = appStore.createUser({
      name,
      email,
      companyName: companyName || 'Home Decor Exporters',
    });

    return NextResponse.json({
      user: newUser,
      token: `mock_jwt_${newUser.id}_${Date.now()}`,
      isDemo: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
