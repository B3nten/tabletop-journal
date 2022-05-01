import { useEffect, useState, useLayoutEffect } from 'react'
import supabase from './supabase'
import toast from 'react-hot-toast'
import { useClientRouter } from './hooks'
import { useSession } from './authentication'

export function useCampaignID(){
    const router = useClientRouter()
    return router.query.campaign
}

//Gets campaign by either ID or URL. Returns null while loading, an empty object if not exist, error if error, or campaign document.
export function useCampaign(id) {
    const [campaign, updateCampaign] = useState({loaded:false, isData:false, error: false})
    const router = useClientRouter()

    async function getByID(id) {
        if (id) {
            let { data, error } = await supabase.from('campaigns').select('*').filter('campaign_id', 'in', `("${id}")`)
            if (error) {
                toast.error('Could not retrieve campaign.')
                updateCampaign({...campaign, loading: false, error: error})
            } else if (data[0] === undefined) {
                toast.error('Campaign does not exist.')
                updateCampaign({...campaign, loaded: true })
            } else {
                updateCampaign({...campaign, ...data[0], loaded: true, isData: true})
            }
        }
    }

    async function getByURL() {
        if (!id && router.query.campaign) {
            let { data, error } = await supabase.from('campaigns').select('*').filter('campaign_id', 'in', `("${router.query.campaign}")`)
            if (error) {
                toast.error('Could not retrieve campaign.')
                updateCampaign({...campaign, loading: false, error: error})
            } else if (data[0] === undefined) {
                toast.error('Campaign does not exist.')
                updateCampaign({...campaign, loaded: true })
            }
            else {
                updateCampaign({...campaign, ...data[0], loaded: true, isData: true})
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
    const [campaigns, updateCampaigns] = useState({loaded:false, isData:false, error: false})

    async function getList() {
        let { data, error } = await supabase.from('campaigns').select('*')
        if (error) {
            toast.error('Could not retrieve campaigns.')
            updateCampaigns({...campaigns, loaded: true, error: error})
        } else if (data === undefined) {
            toast.error('Campaigns do not exist.')
            updateCampaigns({...campaigns, loaded: true})
        } else {
            updateCampaigns({...campaigns, list:data, loaded: true, isData: true})
        }
    }

    useEffect(() => {
        getList()
    }, [])

    return campaigns
}

//Gets character by either ID or URL. Returns null while loading, an empty object if not exist, error if error, or character document.
export function useCharacter(id) {
    const [character, updateCharacter] = useState({loaded:false, isData:false, error: false})
    const router = useClientRouter()
    const session = useSession()

    // async function getByID(id) {
    //     if (id && session) {
    //         let { data, error } = await supabase.from('characters').select('*').filter('character_id', 'in', `("${id}")`)
    //         if (error) {
    //             toast.error('Could not retrieve character.')
    //             updateCharacter({ ...character, loaded:true, error: error})
    //         } else if (data[0] === undefined) {
    //             toast.error('Character does not exist.')
    //             updateCharacter({ ...character, loaded: true})
    //         } else {
    //             updateCharacter({...character, ...data[0], loaded:true, isData: true})
    //         }
    //     }
    // }

    async function getByURL() {
        if (!id && router.query.character && session) {
            let { data, error } = await supabase.from('characters').select('*').filter('character_id', 'in', `("${router.query.character}")`)
            if (error) {
                toast.error('Could not retrieve character.')
                updateCharacter({ ...character, loaded:true, error: error})
            } else if (data[0] === undefined) {
                toast.error('Character does not exist.')
                updateCharacter({ ...character, loaded: true})
            }
            else {
                updateCharacter({...character, ...data[0], loaded:true, isData: true})
            }
        }
    }

    // useEffect(() => {
    //     getByID(id)
    // }, [session])

    useEffect(() => {
        getByURL()
    }, [session])

    return character
}

export function useCharacterList(id) {
    const [characters, updateCharacters] = useState({loaded:false, isData:false, error: false})
    const router = useClientRouter()

    async function getByID(id) {
        if (id) {
            let { data, error } = await supabase.from('characters').select('*').filter('campaign_id', 'in', `("${id}")`)
            if (error) {
                toast.error('Could not retrieve characters.')
                updateCharacters({...characters, loaded: true, error: error})
            } else if (data === undefined) {
                toast.error('Characters do not exist.')
                updateCharacters({...characters, loaded: true, isData: false})
            } else {
                updateCharacters({...characters, list: data, loaded: true, isData: true})
            }
        }
    }

    async function getByURL(id) {
        if (!id && router.query.campaign) {
            let { data, error } = await supabase.from('characters').select('*').filter('campaign_id', 'in', `("${router.query.campaign}")`)
            if (error) {
                toast.error('Could not retrieve characters.')
                updateCharacters({...characters, loaded: true, error: error})
            } else if (data === undefined) {
                toast.error('Characters do not exist.')
                updateCharacters({...characters, loaded: true, isData: false})
            } else {
                updateCharacters({...characters, list: data, loaded: true, isData: true})
            }
        }
    }


    useEffect(() => {
        getByID()
    }, [])

    useEffect(() => {
        getByURL()
    }, [])

    return characters
}


export function useDocument(from, id_column, id){
    const [document, updateDocument] = useState({loaded:false, isData:false, error: false})
    const session = useSession()

    async function getByID(id) {
        if (id && session) {
            let { data, error } = await supabase.from(from).select('*').filter(id_column, 'in', `("${id}")`).single()
            if (error) {
                updateDocument({ ...document, loaded:true, error: error})
            } else if (data[0] === (undefined || [] || {})) {
                toast.error('Character does not exist.')
                updateDocument({ ...document, loaded: true})
            } else {
                updateDocument({...document, ...data, loaded:true, isData: true})
            }
        }
    }

    useEffect(() => {
        getByID(id)
    }, [session])

    return document

}

export function useDocumentList(from){
    const [documents, updateDocuments] = useState({loaded:false, isData:false, error: false})
    const router = useClientRouter()

    async function getByURL() {
        if (router.query.campaign) {
            let { data, error } = await supabase.from(from).select('*').filter('campaign_id', 'in', `("${router.query.campaign}")`)
            if (error) {
                updateDocuments({...documents, loaded: true, error: error})
            } else if (data === (undefined || [] || {})) {
                updateDocuments({...documents, loaded: true, isData: false})
            } else {
                updateDocuments({...documents, list: data, loaded: true, isData: true})
            }
        }
    }

    useEffect(() => {
        getByURL()
    }, [])

    return documents
}