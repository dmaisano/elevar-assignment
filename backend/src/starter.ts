// ? custom type - https://stackoverflow.com/questions/53276792/define-a-list-of-optional-keys-for-typescript-record
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T
}

export type DataLayerEventName =
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

export type ConfigEventKey =
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

export type Events = Record<ConfigEventKey, boolean>

export type SubconfigCommon = {
  live: boolean
}

export type UAEventsConnectorConfig = SubconfigCommon & {
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

export type TikTokPayload = {
  ttid: string // Event shouldn't be sent if missing ttid
  event: Extract<ConfigEventKey, 'addToCart' | 'login'>
}

export type UAPayload = {
  cid?: string
  uid?: string
  en: Extract<
    ConfigEventKey,
    | 'addPaymentInfo'
    | 'addShippingInfo'
    | 'addToCart'
    | 'beginCheckout'
    | 'login'
    | 'purchase'
    | 'refund'
    | 'removeFromCart'
    | 'selectItem'
    | 'signUp'
    | 'subscriptionPurchase'
    | 'pageView'
    | 'viewCart'
    | 'viewItem'
    | 'viewItemList'
    | 'viewSearchResults'
  >
}

export type TikTokEventsConnectorConfig = SubconfigCommon & {
  accessToken: string
  apiVersion: string
  pixelId: string
  testCode: string | null
  enabledEvents: Pick<Events, 'addToCart' | 'signUp'>
}
export type Context = {
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

export const uaEventMap: Record<DataLayerEventName, ConfigEventKey> = {
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

export const tiktokEventMap: Record<'dl_add_to_cart' | 'dl_login', ConfigEventKey> = {
  dl_add_to_cart: 'addToCart',
  dl_login: 'login',
}
