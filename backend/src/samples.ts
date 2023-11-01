import { Context } from './starter'

export const sampleUaTikTokContext: Context = {
  message: {
    event_name: 'dl_add_to_cart',
    attributes: {
      _ga: '1234567.1234567',
      user_id: 'user_123',
      ttclid: 'JSON Bourne',
    },
  },
  config: {
    consentRequired: false,
    ua: {
      live: true,
      measurementId: 'UA-12345-6',
      enabledEvents: {
        addPaymentInfo: true,
        addShippingInfo: true,
        addToCart: true,
        beginCheckout: true,
        login: true,
        pageView: true,
        purchase: true,
        removeFromCart: true,
        refund: true,
        selectItem: true,
        signUp: true,
        subscriptionPurchase: true,
        viewCart: true,
        viewItem: true,
        viewItemList: true,
        viewSearchResults: true,
      },
    },
    tiktok: {
      live: true,
      accessToken: '123123',
      apiVersion: 'v1.2',
      pixelId: '321321',
      testCode: '123',
      enabledEvents: {
        addToCart: true,
        signUp: true,
      },
    },
  },
}

export const disabledConsentContext = {
  ...sampleUaTikTokContext,
  message: {
    event_name: 'dl_login',
    attributes: {
      _ga: '7654321.7654321',
      user_id: 'user_321',
    },
  },
  config: {
    consentRequired: true,
    ua: {
      measurementId: 'UA-65432-1',
    },
    tiktok: {
      live: true,
      accessToken: 'tiktok accessToken',
      apiVersion: 'v1.3',
      pixelId: 'foobarbaz',
      testCode: '321',
    },
  },
} as Context
