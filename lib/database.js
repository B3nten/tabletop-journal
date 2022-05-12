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

export function useSessionList(campaign) {
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
      } else if (data[0] === (undefined || [] || {})) {
        updateSessions({ ...sessions, loaded: true })
      } else {
        updateSessions({ ...sessions, data: [...data], loaded: true, isData: true })
      }
    }
    if(campaign)getSessions()
  }, [campaign])

  return sessions
}