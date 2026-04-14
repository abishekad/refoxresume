import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1'

function basicAuth(keyId: string, keySecret: string): string {
  return 'Basic ' + btoa(`${keyId}:${keySecret}`)
}

async function hmacSHA256(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return new TextDecoder().decode(hexEncode(new Uint8Array(signature)))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json()

    // Auth Check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      console.error('Auth Error:', userError)
      throw new Error('Unauthenticated')
    }

    // ── CREATE ORDER ──────────────────────────────────────────────────────────
    if (action === 'create_order') {
      const rzpKeyId = (Deno.env.get('RAZORPAY_KEY_ID') ?? '').trim()
      const rzpKeySecret = (Deno.env.get('RAZORPAY_KEY_SECRET') ?? '').trim()

      if (!rzpKeyId || !rzpKeySecret) {
        throw new Error('Server configuration error: Razorpay keys are missing on the Edge Function.')
      }

      const response = await fetch(`${RAZORPAY_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth(rzpKeyId, rzpKeySecret),
        },
        body: JSON.stringify({
          amount: 2900,          // in paise → ₹29
          currency: 'INR',
          receipt: `receipt_${user.id.replace(/-/g, '').substring(0, 10)}_${Date.now()}`,
          notes: { user_id: user.id, user_email: user.email }
        })
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error('Razorpay order error: ' + err)
      }

      const order = await response.json()
      return new Response(JSON.stringify(order), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ── VERIFY PAYMENT ────────────────────────────────────────────────────────
    if (action === 'verify_payment') {
      const rzpKeySecret = (Deno.env.get('RAZORPAY_KEY_SECRET') ?? '').trim()
      
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        throw new Error('Missing payment verification fields')
      }

      // Verify HMAC signature
      const expectedSignature = await hmacSHA256(
        rzpKeySecret,
        `${razorpay_order_id}|${razorpay_payment_id}`
      )

      if (expectedSignature !== razorpay_signature) {
        throw new Error('Invalid payment signature')
      }

      // Mark user as paid using service role
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { is_paid: true }
      })

      // Record payment in DB (non-blocking)
      await supabaseAdmin.from('payments').insert({
        user_id: user.id,
        amount: 29.00,
        status: 'success',
        payment_id: razorpay_payment_id
      }).catch(() => {})

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
