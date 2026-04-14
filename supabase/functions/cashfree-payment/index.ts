import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CASHFREE_APP_ID = Deno.env.get('CASHFREE_API_KEY') ?? Deno.env.get('CASHFREE_APP_ID') ?? ""
const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY') ?? ""
const CASHFREE_ENV = "PRODUCTION" // using prod endpoint as per credential format
const BASE_URL = CASHFREE_ENV === "PRODUCTION" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"
const API_VERSION = "2023-08-01"

serve(async (req) => {
   if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
   }

   try {
      const { action, customer_details, return_url, order_id: input_order_id } = await req.json()

      // Auth Check
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) throw new Error('Missing Authorization header')
      
      const token = authHeader.replace('Bearer ', '')
      const supabaseClient = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_ANON_KEY') ?? '',
         { auth: { persistSession: false } }
      )

      const {
         data: { user },
         error: userError
      } = await supabaseClient.auth.getUser(token)

      if (userError || !user) {
          console.error('Auth Error:', userError);
          throw new Error('Unauthenticated')
      }

      if (action === 'create_order') {
         const order_id = `ORDER_${user.id.replace(/-/g, '').substring(0, 10)}_${Date.now()}`

         const payload: any = {
            order_id,
            order_amount: 29,
            order_currency: "INR",
            customer_details: {
               customer_id: user.id.replace(/-/g, '').substring(0, 20), // limits
               customer_name: customer_details?.name || user.user_metadata?.full_name || 'RefoxAI User',
               customer_email: user.email,
               customer_phone: customer_details?.phone || "9999999999" // required by CF
            }
         }

         // Protect against Cashfree rejecting local http:// URLs in production
         if (return_url && return_url.startsWith('https://')) {
            payload.order_meta = {
               return_url: return_url + `?verify=true&order_id=${order_id}`
            }
         }

         const response = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'x-client-id': CASHFREE_APP_ID,
               'x-client-secret': CASHFREE_SECRET_KEY,
               'x-api-version': API_VERSION
            },
            body: JSON.stringify(payload)
         })

         if (!response.ok) {
            const err = await response.text();
            throw new Error('Cashfree config error: ' + err)
         }

         const data = await response.json()
         return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (action === 'verify_order') {
         if (!input_order_id) throw new Error('Missing order_id')

         const response = await fetch(`${BASE_URL}/orders/${input_order_id}`, {
            headers: {
               'Accept': 'application/json',
               'x-client-id': CASHFREE_APP_ID,
               'x-client-secret': CASHFREE_SECRET_KEY,
               'x-api-version': API_VERSION
            }
         })
         const data = await response.json()

         if (data.order_status === 'PAID') {
            const supabaseAdmin = createClient(
               Deno.env.get('SUPABASE_URL') ?? '',
               Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            // Update user token
            await supabaseAdmin.auth.admin.updateUserById(user.id, { user_metadata: { is_paid: true } })

            // Attempt insert into public.payments if it exists locally
            await supabaseAdmin.from('payments').insert({
               user_id: user.id,
               amount: 29.00,
               status: 'success',
               payment_id: input_order_id
            }).catch(() => { })

            return new Response(JSON.stringify({ success: true, order: data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
         } else {
            return new Response(JSON.stringify({ success: false, status: data.order_status }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
         }
      }

      throw new Error('Invalid action')
   } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
   }
})
