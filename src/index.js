const React = require('react')
const { createContext, useContext, useEffect, useState } = require('react')

const _objectToString = (obj) => {
    let query = ''
    for (const [key, value] of Object.entries(obj)) {
        if (query) query += `&`
        query += key
        if (value !== undefined) query += `=${value}`
    }
    return query
}
const _objectIsNull = (obj) => {
    return JSON.stringify(obj) === '{}' || obj === null || obj === undefined
}
const _objectIsSame = (currentObj, targetObj) => {
    return JSON.stringify(currentObj) === JSON.stringify(targetObj)
}
const _objectWithoutProperties = (obj, keys) => {
    const target = {}
    for (const key in obj) {
        if (keys.indexOf(key) >= 0) continue
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
        target[key] = obj[key]
    }
    return target
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

const useCacheApi = (key, query = {}, options = null) => {
    try {
        const { baseURL, cache } = useContext(CacheApiContext)
        const [data, setData] = useState(null)
        const [isValidation, setIsValidation] = useState(false)
        const [doFetch, setDoFetch] = useState(false)
        const cacheData = cache.get(key) && cache.get(key).data
        const documentObject = () => {
            if (typeof window === 'object' && immutability !== true) {
                return document.location.pathname
            }
        }

        // Set immutability
        let immutability = false
        try {
            if (options && options.immutability === true) {
                immutability = true
            }
        } catch (e) {}
        options = _objectWithoutProperties(options, ['immutability'])

        // Execute key when key is function
        if (typeof key !== 'string') {
            key = key()
        }

        const getData = async () => {
            setDoFetch(false)
            setIsValidation(true)
            const requestUrl =
                baseURL +
                key +
                String(_objectIsNull(query) ? '' : `?${_objectToString(query)}`)
            const data = await (await fetch(requestUrl, options)).json()
            setData(data)
            setIsValidation(false)
            cache.set(key, { data, query })
        }

        useEffect(() => {
            if (!key) {
                return { data, error: null, isValidation }
            } else if (
                cache.has(key) &&
                (_objectIsNull(query) ||
                    _objectIsSame(cache.get(key).query, query))
            ) {
                setData(cache.get(key).data)
                setIsValidation(false)
            } else {
                setDoFetch(true)
            }
        }, [key, JSON.stringify(query), cacheData])

        useEffect(() => {
            if (documentObject()) {
                setDoFetch(true)
            }
        }, [documentObject()])

        useEffect(() => {
            if (doFetch === true) {
                getData()
            }
        }, [doFetch])

        return { data, error: null, isValidation }
    } catch (error) {
        return { data: null, error, isValidation: false }
    }
}

module.exports = {
    CacheApiConfig,
    useCacheApi,
}
