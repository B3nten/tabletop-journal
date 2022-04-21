import { createClient } from '@supabase/supabase-js'
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseURL, supabaseAnonKey)
export default supabase

export function getDocumentList(){


}

export function getDocumentListByCampaign(){

}

export function getDocumentByID(){


}

export function addDocument(){

}

export function updateDocument(){


}

export function deleteDocument(){
    
}