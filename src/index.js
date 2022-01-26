const React = require('react')
const { createContext, useContext, useEffect, useState } = require('react')

const _objectToString = (obj) => {
    return JSON.stringify(obj).replace(/\{|\}|\"/g, '')
}
const _objectIsNull = (obj) => {
    return JSON.stringify(obj) === '{}'
}
const _objectIsSame = (currentObj, targetObj) => {
    return JSON.stringify(currentObj) === JSON.stringify(targetObj)
}

const cacheApiConfig = {
    baseURL: null,
    cache: new Map(),
}
const CacheApiContext = createContext(cacheApiConfig)
const CacheApiConfig = ({ baseURL, children }) => {
    return React.createElement(
        CacheApiContext.Provider,
        { value: { baseURL: baseURL, cache: cacheApiConfig.cache } },
        React.Children.only(children)
    )
}

// interface query {
//     [key: string]: any
// }
// interface options {
//     [key: string]: any
// }
// type propType = [string, (query | null)?, (options | null)?]
const useCacheApi = (key, query = {}, options = null) => {
    try {
        if (!key) {
            return
        }
        const { baseURL, cache } = useContext(CacheApiContext)
        const [data, setData] = useState(null)
        const [isValidation, setIsValidation] = useState(false)
        if (
            cache.has(key) &&
            (_objectIsNull(query) || _objectIsSame(cache.get(key).query, query))
        ) {
            return { data: cache.get(key).data, error: null, isValidation }
        }

        useEffect(() => {
            const getData = async () => {
                setIsValidation(true)
                const requestUrl =
                    baseURL +
                    key +
                    String(
                        _objectIsNull(query) ? '' : `?${_objectToString(query)}`
                    )
                const data = await fetch(requestUrl, options).json()
                setData(data)
                setIsValidation(false)
                cache.set(key, { data, query })
            }
            getData()
        }, [JSON.stringify(query)])

        return { data, error: null, isValidation }
    } catch (error) {
        return { data: null, error, isValidation: false }
    }
}

module.exports = {
    CacheApiConfig,
    useCacheApi,
}
