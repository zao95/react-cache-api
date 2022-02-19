import { RequestInit } from 'node-fetch'

declare module 'react-cache-api' {
    interface ICacheApiConfig {
        baseURL?: string | null
        children: React.ReactNode
    }
    /**
     * Please enclose the component to call useCacheApi with this component.
     * In the case of nextJS, it is recommended to wrap the component in the _app file.
     * @param props
     * @param props.baseURL The base URL of apis to call to useCacheApi
     * @param props.children Components to use useCacheApi
     */
    export function CacheApiConfig({ baseURL, children }: ICacheApiConfig): any

    interface query {
        [key: string]: any
    }
    interface IReturn {
        data: {
            [key: string]: any
        }
        error: {
            [key: string]: any
        }
        isValidation: boolean
    }
    /**
     * If the cache has a response value for the corresponding key and requests it without query, the value is taken from the cache.
     * If not, request api through fetch.
     * @param key The key of the cache and api's url
     * @param query A query to send to api
     * @param options Fetch api's options
     */
    export function useCacheApi(
        key: string | (() => string | null | undefined),
        query?: any | null,
        options?: RequestInit | null
    ): IReturn
}
