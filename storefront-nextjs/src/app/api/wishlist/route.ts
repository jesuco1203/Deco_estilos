import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient(true);
  const { searchParams } = new URL(request.url);
  const anonId = searchParams.get('anonId');

  if (!anonId) {
    return NextResponse.json({ error: 'Missing anonId' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select('items')
      .eq('anon_id', anonId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching wishlist:', error);
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }

    return NextResponse.json({ wishlist: data ? data.items : [] });
  } catch (error) {
    console.error('Unexpected error in wishlist GET API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
