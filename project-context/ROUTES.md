# Routing

Routing is managed via **React Router v7** in `src/router/index.tsx`.

## Route Tree

```
/
├── /login                   -> <Login />
├── /customer-display        -> <CustomerDisplay />
│
├── /pos                     -> <POSLayout />
│   └── /pos/index           -> <POS />
│
└── /                        -> <AppLayout />
    ├── /sales               -> <Sales />
    ├── /products            -> <Products />
    ├── /categories          -> <Categories />
    ├── /inventory           -> <Inventory />
    │   
    │   -- The following routes are restricted to Admin/Manager roles --
    ├── /purchases           -> <Purchases />
    ├── /reports             -> <Reports />
    ├── /settings            -> <Settings />
    └── /admin               -> <AdminRoles />
```

## Route Protection
`AppLayout` and `POSLayout` check `useAuthStore().isAuthenticated`. If false, they force a `<Navigate to="/login" replace />`.
`AppLayout` checks `user?.role === 'cashier'` and hides protected links from the sidebar dynamically.
