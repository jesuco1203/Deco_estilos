import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const supabase = await createClient(); // Server-side client

    // Upsert the email into the contacts table
    // onConflict: 'email' ensures that if the email already exists, it updates the existing row.
    // This is suitable for a newsletter subscription where we just want to ensure the email is present.
    const { data, error } = await supabase
      .from('contacts')
      .upsert({ email: email }, { onConflict: 'email' })
      .select();

    if (error) {
      console.error('Error upserting newsletter email:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription successful!', data });
  } catch (error) {
    console.error('Server error during newsletter subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
