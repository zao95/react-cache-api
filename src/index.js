const React = require('react')
const { createContext, useContext, useEffect, useState } = require('react')

const _objectToString = (obj) => {
    let query = ''
    for (const [key, value] of Object.entries(obj)) {
        if (query) query += `&`
        query += key
        if (value) query += `=${value}`
    }
    return query
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

const useCacheApi = (key, query = {}, options = null) => {
    try {
        const { baseURL, cache } = useContext(CacheApiContext)
        const [data, setData] = useState(null)
        const [isValidation, setIsValidation] = useState(false)

        useEffect(() => {
            const getData = async () => {
                setIsValidation(true)
                const requestUrl =
                    baseURL +
                    key +
                    String(
                        _objectIsNull(query) ? '' : `?${_objectToString(query)}`
                    )
                const data = await (await fetch(requestUrl, options)).json()
                setData(data)
                setIsValidation(false)
                cache.set(key, { data, query })
            }

            if (!key) throw Error('key is not defined')
            else if (
                cache.has(key) &&
                (_objectIsNull(query) ||
                    _objectIsSame(cache.get(key).query, query))
            ) {
                setData(cache.get(key))
                setIsValidation(false)
            } else {
                getData()
            }
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
