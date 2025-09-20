import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient(true);
  const { anonId, productId, action } = await request.json();

  if (!anonId || !productId || !action) {
    return NextResponse.json({ error: 'Missing anonId, productId, or action' }, { status: 400 });
  }

  try {
    // Fetch the current wishlist for the anonId
    const { data: existingWishlist, error: fetchError } = await supabase
      .from('wishlists')
      .select('items')
      .eq('anon_id', anonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found (first time user)
      console.error('Error fetching wishlist:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }

    let currentItems: number[] = existingWishlist ? existingWishlist.items : [];

    if (action === 'add') {
      if (!currentItems.includes(productId)) {
        currentItems.push(productId);
      }
    } else if (action === 'remove') {
      currentItems = currentItems.filter(id => id !== productId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Upsert the updated wishlist
    const { error: upsertError } = await supabase
      .from('wishlists')
      .upsert({ anon_id: anonId, items: currentItems }, { onConflict: 'anon_id' });

    if (upsertError) {
      console.error('Error upserting wishlist:', upsertError);
      return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }

    return NextResponse.json({ success: true, wishlist: currentItems });
  } catch (error) {
    console.error('Unexpected error in wishlist toggle API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
