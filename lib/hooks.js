import { useRouter } from 'next/router'
import { useEffect,useLayoutEffect } from "react"

export function useRouterQuery(callback){
    const router = useRouter()
    useEffect(() => {
        if (Object.keys(router.query).length > 0 ) {
            callback && callback()
        }
    }, [router.query])
    return router.query
}

export function useEnsureBrowserPaintsBeforeEffect(effect, dependencies) {
    useEffect(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          effect();
        }, 0);
      });
    }, dependencies);
  }