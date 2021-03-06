# React Cache API

React Cache API is a React Hooks library for data fetching.

It was inspired by the [swr](https://swr.vercel.app/).

**[Demo website](https://cache-api.awmaker.com)**

## ๐Quick Overview

```javascript
// Please wrap the component to call useCacheApi with this component.
// In the case of nextJS, it is recommended to wrap the component in the _app file.
<CacheApiConfig baseURL="https://yourapibaseurl">
    <Component />
</CacheApiConfig>
```

```javascript
// If the response value is cached, return cached value.
// If not, request api through fetch.
const { data, error, isValidation } = useCacheApi('/', query)

// Even if you write without a query on another page, it gets the cached value.
const { data, error, isValidation } = useCacheApi('/')
```

## โจFeature

-   When using the cache, it is not necessary to write the boiler plate code due to query.

## ๐ Contributing

Pull requests and ๐ stars are always welcome.

For major changes, please [open an issue](https://github.com/zao95/react-cache-api/issues/new) first to discuss what you would like to change.

## โ Donate

-   Please buy me coffee so that I can continue to make convenient packages.

    https://www.buymeacoffee.com/awmaker

## ๐ฉ Contact

awmaker@kakao.com

## Others

๐ We recommend third-party services with react-cache-api.

-   We recommand [nextJS](https://nextjs.org/) service for more convenient react use.
