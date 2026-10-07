import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/db/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, isDemo } = await req.json();

    // 1. Quick Demo Login Handler
    if (isDemo) {
      const demoUser = appStore.getUsers()[0] || {
        id: 'usr_demo',
        email: 'agam@decorreach.com',
        name: 'Agam Pathak',
        companyName: 'Heritage Decor Exporters',
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({
        user: demoUser,
        token: `mock_jwt_${demoUser.id}_${Date.now()}`,
        isDemo: true,
      });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 2. Real Supabase Auth (when credentials exist)
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
            companyName: data.user.user_metadata?.company_name || 'Home Decor Seller',
            createdAt: data.user.created_at,
          },
          session: data.session,
        });
      }
    }

    // 3. Resilient Local / Demo Auth Fallback
    let existingUser = appStore.getUserByEmail(email);
    if (!existingUser) {
      // Auto-register in mock mode if user signs in with any email
      existingUser = appStore.createUser({
        email,
        name: email.split('@')[0],
        companyName: 'Home Decor Studio',
      });
    }

    return NextResponse.json({
      user: existingUser,
      token: `mock_jwt_${existingUser.id}_${Date.now()}`,
      isDemo: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
