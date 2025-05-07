export const rolesList = {
  content: [
    {
      roleId: 1,
      creationDate: '2024-03-08T13:04:51.520Z',
      modificationDate: null,
      name: 'SUPER_ADMIN',
      description: 'Super administration',
      externalReference: null,
      permissions: [
        'ACCESS_MY_ACCOUNT',
        'ACCESS_ALL_ACCOUNT',
        'ACCESS_ALL_USERS',
        'MANAGE_ROLES'
      ]
    },
    {
      roleId: 25,
      creationDate: '2024-04-20T02:06:11.142Z',
      modificationDate: null,
      name: 'Role 1',
      description: 'Description 1',
      externalReference: 'ec1aa462-1a8e-4981-a089-a2d8487a6733',
      permissions: [
        'ACCESS_MY_ACCOUNT'
      ]
    },
    {
      roleId: 26,
      creationDate: '2024-04-20T12:13:57.154Z',
      modificationDate: null,
      name: 'Role 2',
      description: 'Description 2',
      externalReference: '648e870d-2a95-41b7-9b35-51b0d9c4b8dc',
      permissions: [
        'MANAGE_ROLES'
      ]
    },
  ],
  pageable: {
    pageNumber: 0,
    pageSize: 20,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true
    },
    offset: 0,
    paged: true,
    unpaged: false
  },
  last: true,
  totalPages: 1,
  totalElements: 5,
  size: 20,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true
  },
  first: true,
  numberOfElements: 5,
  empty: false
}
