# Backend Exercise

This exercise is actually real types taken from our app. Our event processor takes in data from
the browser in the form of dataLayer events and sends them to destinations if it is configured to do so.
See `sampleContext` below for a complete example of a message that includes the dataLayer event and configuration.

## Data Layer Events and Configuration Event

```ts
type DataLayerEventName =
  | 'dl_add_payment_info'
  | 'dl_add_shipping_info'
  | 'dl_add_to_cart'
  | 'dl_begin_checkout'
  | 'dl_login'
  | 'dl_purchase'
  | '_refund'
  | 'dl_remove_from_cart'
  | 'dl_select_item'
  | 'dl_sign_up'
  | 'dl_subscription_purchase'
  | 'dl_user_data'
  | 'dl_view_cart'
  | 'dl_view_item'
  | 'dl_view_item_list'
  | 'dl_view_search_results'

type ConfigEventKey =
  | 'addPaymentInfo'
  | 'addShippingInfo'
  | 'addToCart'
  | 'beginCheckout'
  | 'completePayment'
  | 'login'
  | 'pageView'
  | 'purchase'
  | 'refund'
  | 'removeFromCart'
  | 'signUp'
  | 'selectItem'
  | 'subscriptionPurchase'
  | 'viewCart'
  | 'viewItem'
  | 'viewItemList'
  | 'viewSearchResults'

type Events = Record<ConfigEventKey, boolean>
```

## Destination Configuration

Each channel has configuration. We access this configuration often when we process events.
Below shows examples of TikTok and Universal Analytics configuration.

```ts
type SubconfigCommon = {
  live: boolean
}

type UAEventsConnectorConfig = SubconfigCommon & {
  measurementId: string
  enabledEvents: Pick<
    Events,
    | 'addPaymentInfo'
    | 'addShippingInfo'
    | 'addToCart'
    | 'beginCheckout'
    | 'login'
    | 'pageView'
    | 'purchase'
    | 'refund'
    | 'removeFromCart'
    | 'signUp'
    | 'selectItem'
    | 'subscriptionPurchase'
    | 'viewCart'
    | 'viewItem'
    | 'viewItemList'
    | 'viewSearchResults'
  >
}

type TikTokEventsConnectorConfig = SubconfigCommon & {
  accessToken: string
  apiVersion: string
  pixelId: string
  testCode: string | null
  enabledEvents: Pick<Events, 'addToCart' | 'signUp'>
}
```

## Context

The context contains information about the message and is married with additional data (like configuration) to prevent data from being fetched multiple times.

```ts
type Context = {
  message: {
    event_name: DataLayerEventName
    attributes: {
      user_id?: string
      _ga?: string
      ttclid?: string
      consentGranted?: boolean
    }
  }
  config: {
    consentRequired: boolean
    ua: UAEventsConnectorConfig | null
    tiktok: TikTokEventsConnectorConfig | null
  }
}

/* ============================================================= */

type TikTokPayload = {
  ttid: string // Event shouldn't be sent if missing ttid
  event: 'AddToCart' | 'Login'
}

type UAPayload = {
  cid?: string
  uid?: string
  en:
    | 'add_payment_info'
    | 'add_shipping_info'
    | 'add_to_cart'
    | 'begin_checkout'
    | 'login'
    | 'purchase'
    | 'remove_from_cart'
    | 'select_item'
    | 'sign_up'
    | 'subscription_purchase'
    | 'user_data'
    | 'view_cart'
    | 'view_item'
    | 'view_item_list'
    | 'view_search_results'
}

const uaEventMap: Record<DataLayerEventName, ConfigEventKey> = {
  dl_add_payment_info: 'addPaymentInfo',
  dl_add_shipping_info: 'addShippingInfo',
  dl_add_to_cart: 'addToCart',
  dl_begin_checkout: 'beginCheckout',
  dl_login: 'login',
  dl_purchase: 'purchase',
  _refund: 'refund',
  dl_remove_from_cart: 'removeFromCart',
  dl_select_item: 'selectItem',
  dl_sign_up: 'signUp',
  dl_subscription_purchase: 'subscriptionPurchase',
  dl_user_data: 'pageView',
  dl_view_cart: 'viewCart',
  dl_view_item: 'viewItem',
  dl_view_item_list: 'viewItemList',
  dl_view_search_results: 'viewSearchResults',
}

const tiktokEventMap: Record<'dl_add_to_cart' | 'dl_login', ConfigEventKey> = {
  dl_add_to_cart: 'addToCart',
  dl_login: 'login',
}

const buildUaPayload = (context: Context): UAPayload => {
  return {
    cid: context.message.attributes._ga,
    uid: context.message.attributes.user_id,
    en: 'add_to_cart',
    // Other event parameters would go here
  }
}

const buildTikTokPayload = (context: Context): TikTokPayload => {
  return {
    ttid: context.message.attributes.ttclid ?? '', // Event shouldn't be sent if missing ttid
    event: 'AddToCart',
    // Other event parameters would go here
  }
}

const ignoreUaEventReason = (context: Context, payload: UAPayload): string | undefined => {
  if (context.config.consentRequired && !context.message.attributes.consentGranted) {
    return 'Consent not granted'
  } else if (!payload.uid && !payload.cid) {
    return 'Missing user identifier'
  }
}

const sendEventToUa = (context: Context, payload: UAPayload) => {
  console.log(`Sending event to UA for property ${context.config.ua?.measurementId}`, payload)
}
```

## The Exercise

Combine all of this code to come up with a "Plugin Manager".

This code below is very linear and really is only setup to handle the "UA" destination. Ideally, it can support "TikTok" and "UA" destinations.
Please create a "plugin manager" that can support both of these destinations with minimal duplication and special casing.

Ideally, we can use this as a framework for adding more integrations.

Feel free to modify code, types as needed. If you get stuck because of a type, just keep moving on.
This should only be worked on for a couple hours max.

```ts
const processEvent = (context: Context) => {
  const uaConfig = context.config.ua
  const isUaEnabled = Boolean(uaConfig && uaConfig.live && uaConfig.measurementId)
  if (!isUaEnabled) {
    return
  }

  const shouldProcessEvent =
    uaConfig && uaConfig.enabledEvents[uaEventMap[context.message.event_name]]
  if (!shouldProcessEvent) {
    return
  }

  const payload = buildUaPayload(context)
  const ignorePayloadReason = ignoreUaEventReason(context, payload)
  if (ignorePayloadReason) {
    console.log('Ignoring UA Event:', ignorePayloadReason)
    return
  }

  sendEventToUa(context, payload)
}

const sampleContext: Context = {
  message: {
    event_name: 'dl_add_to_cart',
    attributes: {
      _ga: '1234567.1234567',
      user_id: 'user_123',
    },
  },
  config: {
    consentRequired: false,
    ua: {
      live: false,
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
      live: false,
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
processEvent(sampleContext)
```
