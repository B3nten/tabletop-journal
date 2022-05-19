import { useEffect, useState, useLayoutEffect } from 'react'
import supabase from './supabase'
import toast from 'react-hot-toast'
import { useClientRouter } from './hooks'
import { useSession } from './authentication'


//Gets campaign by either ID or URL. Returns null while loading, an empty object if not exist, error if error, or campaign document.
export function useCampaign(id) {
  const [campaign, updateCampaign] = useState({
    loaded: false,
    isData: false,
    error: false,
  })
  const router = useClientRouter()

  async function getByID(id) {
    if (id) {
      let { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .filter('campaign_id', 'in', `("${id}")`)
      if (error) {
        toast.error('Could not retrieve campaign.')
        updateCampaign({ ...campaign, loading: false, error: error })
      } else if (data[0] === undefined) {
        toast.error('Campaign does not exist.')
        updateCampaign({ ...campaign, loaded: true })
      } else {
        updateCampaign({ ...campaign, ...data[0], loaded: true, isData: true })
      }
    }
  }

  async function getByURL() {
    if (!id && router.query.campaign) {
      let { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .filter('campaign_id', 'in', `("${router.query.campaign}")`)
      if (error) {
        toast.error('Could not retrieve campaign.')
        updateCampaign({ ...campaign, loading: false, error: error })
      } else if (data[0] === undefined) {
        toast.error('Campaign does not exist.')
        updateCampaign({ ...campaign, loaded: true })
      } else {
        updateCampaign({ ...campaign, ...data[0], loaded: true, isData: true })
      }
    }
  }

  useEffect(() => {
    getByID(id)
  }, [])

  useEffect(() => {
    getByURL()
  }, [])

  return campaign
}

//Gets campaign list. Returns null while loading, an empty array if not exist, error if error, or campaign list.
export function useCampaignList() {
  const [campaigns, updateCampaigns] = useState({
    loaded: false,
    isData: false,
    error: false,
  })

  async function getList() {
    let { data, error } = await supabase.from('campaigns').select('*')
    if (error) {
      toast.error('Could not retrieve campaigns.')
      updateCampaigns({ ...campaigns, loaded: true, error: error })
    } else if (data === undefined) {
      toast.error('Campaigns do not exist.')
      updateCampaigns({ ...campaigns, loaded: true })
    } else {
      updateCampaigns({ ...campaigns, list: data, loaded: true, isData: true })
    }
  }

  useEffect(() => {
    getList()
  }, [])

  return campaigns
}

export function useDocument(id) {
  const [document, updateDocument] = useState({
    loaded: false,
    isData: false,
    error: false,
  })
  useEffect(() => {
    async function getDocument() {
      let { data, error } = await supabase
        .from('documents')
        .select('*')
        .in('id', [id])
        .single()
      if (error) {
        updateDocument({ ...document, loaded: true, error: error })
      } else if (data[0] === (undefined || [] || {})) {
        updateDocument({ ...document, loaded: true })
      } else {
        updateDocument({ ...document, ...data, loaded: true, isData: true })
      }
    }
    getDocument()
  }, [id])
  return document
}

export function useDocumentList(campaign, type) {
  const [documents, updateDocuments] = useState({
    loaded: false,
    isData: false,
    error: false,
  })
  
  useEffect(() => {
    async function getDocuments() {
      let { data, error } = await supabase
        .from('documents')
        .select('*')
        .in('type', [type])
        .in('campaign_id', [campaign])
        .order('updated_at', { ascending: false })
      if (error) {
        updateDocuments({ ...documents, loaded: true, error: error })
      } else if (data[0] === (undefined || [] || {})) {
        updateDocuments({ ...documents, loaded: true })
      } else {
        updateDocuments({ ...documents, data: [...data], loaded: true, isData: true })
      }
    }
    getDocuments()
  }, [campaign, type])
  return documents
}

export function useGameSessionList(campaign) {
  const [sessions, updateSessions] = useState({
    loaded: false,
    isData: false,
    error: false,
  })

  useEffect(() => {
    async function getSessions() {
      let { data, error } = await supabase
        .from('sessions')
        .select('*')
        .in('campaign_id', [campaign])
        .order('updated_at', { ascending: false })
      if (error) {
        updateSessions({ ...sessions, loaded: true, error: error })
      } else if (data.length === 0) {
        // create session 0 and return it
        console.log('no sessions')
        let { data, error } = await supabase.from('sessions').insert({ campaign_id: campaign, number: 0 }).single()
        console.log(data)
        if (error) {
          // cannot create session 0?
          toast.error(error)
        } else {
          // return session 0
          updateSessions({ ...sessions, data: [data], loaded: true, isData: true })
        }
      } else {
        // return session list
        updateSessions({ ...sessions, data: [...data], loaded: true, isData: true })
      }
    }
    getSessions()
  }, [campaign])

  return sessions
}

export async function newGameSession(campaign) {
  let { data, error } = await supabase
    .from('sessions')
    .select('id')
    .in('campaign_id', [campaign])
  if (error) {
    // error :(
    toast.error('Could not create session. Please refresh and try again.')
    return error
  } else if (data[0] === (undefined || [] || {})) {
    // create first session
    let { data: newData, newError: error } = await supabase.from('sessions').insert({ campaign_id: campaign, number: 0 }).single()
    return newData
  } else {
    // create session
    const number = data.length
    let { data: newData, newError: error } = await supabase.from('sessions').insert({ campaign_id: campaign, number: number }).single()
    return newData
  }
}

export function useAllRecentDocuments(campaign, limit) {
  const [documents, updateDocuments] = useState({
    loaded: false,
    isData: false,
    error: false,
  })
  useEffect(() => {
    async function getDocuments() {
      let { data, error } = await supabase
        .from('documents')
        .select('id, name, type')
        .in('campaign_id', [campaign])
        .order('updated_at', { ascending: false })
        .limit(limit)
      if (error) {
        updateDocuments({ ...documents, loaded: true, error: error })
      } else if (data[0] === (undefined || [] || {})) {
        updateDocuments({ ...documents, loaded: true })
      } else {
        updateDocuments({ ...documents, data: [...data], loaded: true, isData: true })
      }
    }
    getDocuments()
  }, [campaign, limit])
  return documents
}

export function useAllDocuments(campaign, select){
  const [documents, updateDocuments] = useState({
    loaded: false,
    isData: false,
    error: false,
  })
  useEffect(() => {
    async function getDocuments() {
      let { data, error } = await supabase
        .from('documents')
        .select(select)
        .in('campaign_id', [campaign])
        .order('updated_at', { ascending: false })
      if (error) {
        updateDocuments({ ...documents, loaded: true, error: error })
      } else if (data[0] === (undefined || [] || {})) {
        updateDocuments({ ...documents, loaded: true })
      } else {
        updateDocuments({ ...documents, data: [...data], loaded: true, isData: true })
      }
    }
    getDocuments()
  }, [campaign, select])
  return documents

}