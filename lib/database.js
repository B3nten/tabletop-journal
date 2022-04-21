import { useEffect, useState } from 'react'
import supabase from './supabase'
import toast from 'react-hot-toast'
import { useRouterQuery } from './hooks'

//Gets campaign by either ID or URL. Returns null while loading, an empty object if not exist, error if error, or campaign document.
export function useCampaign(id) {
    const [campaign, updateCampaign] = useState(null)
    const query = useRouterQuery()

    async function getByID(id) {
        if (id) {
            let { data, error } = await supabase.from('campaigns').select('*').filter('campaign_id', 'in', `("${id}")`)
            if (error) {
                toast.error('Could not retrieve campaign.')
                updateCampaign({error: error})
            } else if (data[0] === undefined) {
                toast.error('Campaign does not exist.')
                updateCampaign({})
            } else {
                updateCampaign(data[0])
            }
        }
    }

    async function getByURL() {
        if (!id && query.campaign) {
            let { data, error } = await supabase.from('campaigns').select('*').filter('campaign_id', 'in', `("${query.campaign}")`)
            if (error) {
                toast.error('Could not retrieve campaign.')
                updateCampaign({error: error})
            } else if (data[0] === undefined) {
                toast.error('Campaign does not exist.')
                updateCampaign({})
            }
            else {
                updateCampaign(data[0])
            }
        }
    }

    useEffect(() => {
        getByID(id)
    }, [])

    useEffect(() => {
        getByURL()
    }, [query])

    return campaign
}

//Gets campaign list. Returns null while loading, an empty array if not exist, error if error, or campaign list.
export function useCampaignList() {
    const [campaigns, updateCampaigns] = useState(null)

    async function getList() {
        let { data, error } = await supabase.from('campaigns').select('*')
        if (error) {
            toast.error('Could not retrieve campaigns.')
            updateCampaigns({error: error})
        } else if (data === undefined) {
            toast.error('Campaigns do not exist.')
            updateCampaigns([])
        } else {
            updateCampaigns(data)
        }
    }

    useEffect(() => {
        getList()
    }, [])

    return campaigns
}

//Gets character by either ID or URL. Returns null while loading, an empty object if not exist, error if error, or character document.
export function useCharacter(id) {
    const [character, updateCharacter] = useState(null)
    const query = useRouterQuery()

    async function getByID(id) {
        if (id) {
            let { data, error } = await supabase.from('characters').select('*').filter('character_id', 'in', `("${id}")`)
            if (error) {
                toast.error('Could not retrieve character.')
                updateCharacter({error: error})
            } else if (data[0] === undefined) {
                toast.error('Character does not exist.')
                updateCharacter({})
            } else {
                updateCharacter(data[0])
            }
        }
    }

    async function getByURL() {
        if (!id && query.character) {
            let { data, error } = await supabase.from('characters').select('*').filter('character_id', 'in', `("${query.character}")`)
            console.log(data)
            if (error) {
                toast.error('Could not retrieve character.')
                updateCharacter({error: error})
            } else if (data[0] === undefined) {
                toast.error('Character does not exist.')
                updateCharacter({})
            }
            else {
                updateCharacter(data[0])
            }
        }
    }

    useEffect(() => {
        getByID(id)
    }, [])

    useEffect(() => {
        getByURL()
    }, [query])

    return character
}

export function useCharacterList(id) {
    const [characters, updateCharacters] = useState(null)
    const query = useRouterQuery()

    async function getByID(id) {
        if (id) {
            let { data, error } = await supabase.from('characters').select('*').filter('campaign_id', 'in', `("${id}")`)
            if (error) {
                toast.error('Could not retrieve characters.')
                updateCharacters({error: error})
            } else if (data === undefined) {
                toast.error('Characters do not exist.')
                updateCampaigns([])
            } else {
                updateCharacters(data)
            }
        }
    }

    async function getByURL(id) {
        if (!id && query.campaign) {
            let { data, error } = await supabase.from('characters').select('*').filter('campaign_id', 'inn', `("${query.campaign}")`)
            if (error) {
                toast.error('Could not retrieve characters.')
                updateCharacters({error: error})
            } else if (data === undefined) {
                toast.error('Characters do not exist.')
                updateCampaigns([])
            } else {
                updateCharacters(data)
            }
        }
    }


    useEffect(() => {
        getByID()
    }, [])

    useEffect(() => {
        getByURL()
    }, [query])

    return characters
}
