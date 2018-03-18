# customization

## Custom pagination and search string query parametrs

### Default
```js
# Init provider 
this.repository.useRest({
    apiUrl: 'http://site15.ru/api',
    pluralName: 'users',
    paginationMeta: {
        perPage: 5
    }
});
# Switch page
this.repository.setOptions({paginationMeta: {curPage: 3}});
# Request
## GET http://site15.ru/api/users?page=3&limit=5

# Run search
this.repository.loadAll({ searchText: 'test' }).subscribe();
# Request
## GET http://site15.ru/api/users?page=3&limit=5&search=test
```
### Custom
```js
# Init provider 
this.repository.useRest({
    apiUrl: 'http://site15.ru/api',
    pluralName: 'users',
    paginationMeta: {
        perPage: 5
    }
    actionOptions:{
        requestLoadAllPaginationQuery: 
            (currentUrl, paginationMeta, action) =>
                (currentUrl.indexOf('?') === -1 ? '?' : '&') +
                    `cur_page=${paginationMeta.curPage}&per_page=${paginationMeta.perPage}`,
        requestLoadAllSearchQuery: 
            (currentUrl, filter, action) =>
                (filter && filter.searchText) ?
                    ((currentUrl.indexOf('?') === -1 ? '?' : '&') + `q=${filter.searchText}`) : ''
    }
});

# Switch page
this.repository.setOptions({paginationMeta: {curPage: 3}});
# Request
## GET http://site15.ru/api/users?cur_page=3&per_page=5

# Run search
this.repository.loadAll({ searchText: 'test' }).subscribe();
# Request
## GET http://site15.ru/api/users?cur_page=3&per_page=5&q=test
```

## Custom response from REST

### Default
```js
# Init provider 
this.repository.useRest({
    apiUrl: 'http://site15.ru/api',
    pluralName: 'users',
    paginationMeta: {
        perPage: 5
    }
});
# Request
## GET http://site15.ru/api/users?page=3&limit=5
# Response (data)
{
    headers: {
        'x-total-count': 2
    },
    body: [
        {
            id:1, username:'user1'
        },
        {
            id:1, username:'user2'
        }
    ]
}
# Entities from response 
return data.body;
# Total count from response 
return +data.headers['x-total-count'];
```
### Custom
```js
# Init provider 
this.repository.useRest({
    apiUrl: 'http://site15.ru/api',
    pluralName: 'users',
    paginationMeta: {
        perPage: 5
    },
    actionOptions: {
        // Total count from response 
        responseLoadAllTotalCount:
            (data, action) =>
                return data.body.meta.totalResults,
        // Entities from response 
        responseData: 
            (data, action) =>
                switch(action) { 
                    case ProviderActionEnum.Create: { 
                        return data.body.user;
                        break; 
                    } 
                    case ProviderActionEnum.Append: { 
                        return data.body.user;
                        break; 
                    } 
                    case ProviderActionEnum.Update: { 
                        return data.body.user;
                        break; 
                    } 
                    case ProviderActionEnum.Patch: { 
                        return data.body.user;
                        break; 
                    } 
                    case ProviderActionEnum.Load: { 
                        return data.body.user;
                        break; 
                    } 
                    case ProviderActionEnum.LoadAll: { 
                        return data.body.users;
                        break; 
                    } 
                    default: { 
                        return data.body;
                        break; 
                    } 
                }
    }
});
# Request
## GET http://site15.ru/api/users?page=3&limit=5
# Response (data)
{
    headers: {},
    body: {
        meta: {
            totalResults: 2
        }, 
        users: [
            {
                id:1, username:'user1'
            },
            {
                id:1, username:'user2'
            }
        ]
    }
}
```