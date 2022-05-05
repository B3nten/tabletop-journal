import router, { makePublicRouterInstance, useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { match } from 'path-to-regexp'

export function useRouterQuery(callback) {
  const router = useRouter()
  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      callback && callback()
    }
  }, [router.query])
  return router.query
}

export function useEnsureBrowserPaintsBeforeEffect(effect, dependencies) {
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        effect()
      }, 0)
    })
  }, dependencies)
}

// @link https://github.com/hexetia/use-client-router
function fixClientRouter() {
  if (typeof window !== 'undefined') {
    const windowPathname = window.location.pathname
    const input = router.pathname.replaceAll('[',':').replaceAll(']','')
    return {
      ...makePublicRouterInstance(router.router),
      pathname: windowPathname,
      query: (match(input)(window.location.pathname)).params,
    }
  } else {
    return { query: {}, pathname: '', route: '', asPath: '', basePath: '' }
  }
}

export function useClientRouter(){
  useRouter()
  return fixClientRouter()
}

export function useMounted(){
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{
    setMounted(true)
  }, [])
  return mounted
}