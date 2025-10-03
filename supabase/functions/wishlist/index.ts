import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const parseCookie = (cookieHeader: string | null | undefined, key: string) => {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const [cookieKey, ...rest] = trimmed.split('=')
    if (cookieKey === key) {
      return rest.join('=') || undefined
    }
  }
  return undefined
}

const toNumberArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      const parsed = Number(item)
      return Number.isFinite(parsed) ? parsed : null
    })
    .filter((item): item is number => item !== null)
}

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname

  const cookieHeader = req.headers.get('cookie') ?? undefined
  const anonIdHeader = req.headers.get('x-anon-id') ?? undefined

  let body: any = undefined
  if (req.method === 'POST') {
    try {
      const raw = await req.text()
      body = raw ? JSON.parse(raw) : undefined
    } catch (_) {
      body = undefined
    }
  }

  const anonIdFromCookie = parseCookie(cookieHeader, 'anon_id')
  const anonId = anonIdHeader ?? anonIdFromCookie ?? body?.anonId

  if (!anonId) {
    return new Response(JSON.stringify({ error: 'anonId missing' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const SUPABASE_URL = Deno.env.get('SB_URL')!
  const SERVICE_ROLE = Deno.env.get('SB_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  })

  try {
    if (path.endsWith('/list') && req.method === 'GET') {
      const contactId = url.searchParams.get('contactId') ?? req.headers.get('x-contact-id') ?? body?.contactId

      const { data: anonRow, error: anonError } = await supabase
        .from('wishlists')
        .select('id, items, contact_id')
        .eq('anon_id', anonId)
        .maybeSingle()
      if (anonError) throw anonError

      let contactRow: { id: string; items: unknown } | null = null
      if (contactId) {
        const { data: contactData, error: contactError } = await supabase
          .from('wishlists')
          .select('id, items, anon_id')
          .eq('contact_id', contactId)
          .maybeSingle()
        if (contactError && contactError.code !== 'PGRST116') throw contactError
        contactRow = contactData ?? null
      }

      const itemsSet = new Set<number>()
      toNumberArray(anonRow?.items).forEach((item) => itemsSet.add(item))
      toNumberArray(contactRow?.items).forEach((item) => itemsSet.add(item))

      const items = Array.from(itemsSet)
      const resolvedContactId = typeof anonRow?.contact_id === 'string' && anonRow.contact_id
        ? anonRow.contact_id
        : contactRow?.id ?? (typeof contactId === 'string' ? contactId : null)

      return new Response(JSON.stringify({ items, contactId: resolvedContactId ?? null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (path.endsWith('/admin/truncate') && req.method === 'POST') {
      const providedToken = req.headers.get('x-reset-token') ?? body?.resetToken ?? ''
      const expectedToken = Deno.env.get('RESET_TOKEN') ?? 'dev-reset'

      if (!providedToken || providedToken !== expectedToken) {
        return new Response(JSON.stringify({ error: 'unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { error: deleteWishlistsError } = await supabase
        .from('wishlists')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      if (deleteWishlistsError) throw deleteWishlistsError

      const { error: deleteContactsError } = await supabase
        .from('contacts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      if (deleteContactsError && deleteContactsError.code !== 'PGRST116') throw deleteContactsError

      return new Response(JSON.stringify({ status: 'cleared' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (path.endsWith('/toggle') && req.method === 'POST') {
      const productId = Number(body?.productId)
      if (!Number.isFinite(productId)) {
        return new Response(JSON.stringify({ error: 'productId missing' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { data: wishlistRow, error: fetchError } = await supabase
        .from('wishlists')
        .select('id, items')
        .eq('anon_id', anonId)
        .maybeSingle()
      if (fetchError) throw fetchError

      const currentItems = toNumberArray(wishlistRow?.items)
      const hasItem = currentItems.includes(productId)
      const updatedItems = hasItem
        ? currentItems.filter((id) => id !== productId)
        : [...currentItems, productId]

      if (wishlistRow) {
        const { error: updateError } = await supabase
          .from('wishlists')
          .update({ items: updatedItems })
          .eq('id', wishlistRow.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('wishlists')
          .insert({ anon_id: anonId, items: updatedItems })
        if (insertError) throw insertError
      }

      return new Response(JSON.stringify({
        status: hasItem ? 'removed' : 'added',
        items: updatedItems,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (path.endsWith('/identify') && req.method === 'POST') {
      const identity = typeof body?.identity === 'string' ? body.identity.trim() : ''
      const productId = Number(body?.productId)

      if (!identity) {
        return new Response(JSON.stringify({ error: 'identity missing' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const identityColumn = identity.includes('@') ? 'email' : 'phone'

      let { data: contact, error: contactError } = await supabase
        .from('contacts')
        .select('id, email, phone')
        .eq(identityColumn, identity)
        .maybeSingle()
      if (contactError) throw contactError

      if (!contact) {
        const { data: newContact, error: newContactError } = await supabase
          .from('contacts')
          .insert({ [identityColumn]: identity })
          .select('id, email, phone')
          .single()
        if (newContactError) throw newContactError
        contact = newContact
      } else if (!contact[identityColumn]) {
        const { data: updatedContact, error: updateContactError } = await supabase
          .from('contacts')
          .update({ [identityColumn]: identity })
          .eq('id', contact.id)
          .select('id, email, phone')
          .single()
        if (updateContactError) throw updateContactError
        contact = updatedContact
      }

      const { data: mainWishlist, error: mainWishlistError } = await supabase
        .from('wishlists')
        .select('id, items, anon_id')
        .eq('contact_id', contact.id)
        .maybeSingle()
      if (mainWishlistError) throw mainWishlistError

      const { data: anonWishlist, error: anonWishlistError } = await supabase
        .from('wishlists')
        .select('id, items, anon_id')
        .eq('anon_id', anonId)
        .maybeSingle()
      if (anonWishlistError) throw anonWishlistError

      const itemsSet = new Set<number>()
      toNumberArray(mainWishlist?.items).forEach((item) => itemsSet.add(item))
      toNumberArray(anonWishlist?.items).forEach((item) => itemsSet.add(item))

      if (Number.isFinite(productId)) {
        itemsSet.add(productId)
      }

      const finalItems = Array.from(itemsSet)

      if (mainWishlist) {
        const { error: updateMainError } = await supabase
          .from('wishlists')
          .update({ items: finalItems, anon_id: mainWishlist.anon_id ?? anonId })
          .eq('id', mainWishlist.id)
        if (updateMainError) throw updateMainError

        if (anonWishlist && anonWishlist.id !== mainWishlist.id) {
          const { error: updateAnonError } = await supabase
            .from('wishlists')
            .update({ items: finalItems, contact_id: contact.id })
            .eq('id', anonWishlist.id)
          if (updateAnonError) throw updateAnonError
        }

        return new Response(JSON.stringify({
          contactId: contact.id,
          items: finalItems,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (anonWishlist) {
        const { data: updatedAnon, error: updateAnonError } = await supabase
          .from('wishlists')
          .update({ items: finalItems, contact_id: contact.id })
          .eq('id', anonWishlist.id)
          .select('items')
          .single()
        if (updateAnonError) throw updateAnonError

        return new Response(JSON.stringify({
          contactId: contact.id,
          items: toNumberArray(updatedAnon?.items),
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { data: insertedWishlist, error: insertWishlistError } = await supabase
        .from('wishlists')
        .insert({ anon_id: anonId, contact_id: contact.id, items: finalItems })
        .select('items')
        .single()
      if (insertWishlistError) throw insertWishlistError

      return new Response(JSON.stringify({
        contactId: contact.id,
        items: toNumberArray(insertedWishlist?.items),
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not found', { status: 404 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'server_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
