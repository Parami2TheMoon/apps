﻿export default [
  {
    path: '/',
    name: 'index',
    hideInMenu: true,
    component: './Index',
  },
  {
    path: '/create',
    name: 'create',
    hideInMenu: true,
    component: './Account/CreateAccount',
  },
  {
    path: '/recover',
    name: 'recover',
    hideInMenu: true,
    routes: [
      {
        path: '/recover',
        name: 'recover',
        component: './Account/RecoverAccount',
      },
      {
        path: '/recover/link',
        redirect: '/',
      },
      {
        path: '/recover/link/#/:mnemonic',
        name: 'recover.withlink',
        component: './Account/RecoverAccount',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/wallet',
    name: 'wallet',
    icon: 'WalletFilled',
    access: 'canUser',
    hideChildrenInMenu: true,
    routes: [
      {
        path: '/wallet',
        name: 'wallet',
        component: './Wallet/Dashboard',
      },
      {
        path: '/wallet/send',
        name: 'wallet.send',
        component: './Wallet/Send',
      },
      {
        path: '/wallet/receive',
        name: 'wallet.receive',
        component: './Wallet/Receive',
      },
      {
        path: '/wallet/buy',
        name: 'wallet.buy',
        component: './Wallet/Buy',
      },
      {
        path: '/wallet/charge',
        name: 'wallet.charge',
        component: './Wallet/Charge',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/record',
    name: 'record',
    icon: 'OrderedListOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Record/Record',
  },
  {
    path: '/social',
    name: 'social',
    icon: 'ApiOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Social/Bind',
    routes: [
      {
        path: '/social/:from',
        name: 'social',
        component: './Social/Bind',
      },
    ],
  },
  {
    path: '/creator',
    name: 'creator',
    icon: 'SmileOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Creator/Dashboard',
  },
  {
    path: '/mining',
    name: 'mining',
    icon: 'DeploymentUnitOutlined',
    access: 'canUser',
    hideChildrenInMenu: true,
    component: './Miner/Mining',
  },
  {
    path: '/visa',
    name: 'visa',
    icon: 'FileProtectOutlined',
    access: 'canUser',
    hideInMenu: true,
    component: './Visa/Visa',
    headerRender: false,
    footerRender: false,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'BlockOutlined',
    hideInMenu: true,
    headerRender: false,
    footerRender: false,
    component: './Dashboard/app',
    routes: [
      {
        path: '/dashboard',
        name: 'Index',
        component: './Dashboard/pages/Index',
        hideInMenu: true,
        menuRender: false,
      },
      {
        path: '/dashboard/did',
        name: 'DID',
        component: './Dashboard/pages/Did',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/ads',
        name: 'Ads',
        component: './Dashboard/pages/Ads',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/bridge',
        name: 'Bridge',
        component: './Dashboard/pages/Bridge',
        access: 'canDashboard',
      },
      {
        path: '/dashboard/stake',
        name: 'Stake',
        component: './Dashboard/pages/Stake',
      },
      {
        path: '/dashboard/farm',
        name: 'Farm',
        component: './Dashboard/pages/Farm',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/did:kol',
    hideInMenu: true,
    exact: true,
    headerRender: false,
    component: './Creator/Explorer',
  },
  {
    component: './404',
  },
];
