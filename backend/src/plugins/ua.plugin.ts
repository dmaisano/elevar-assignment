import {
  ConfigEventKey,
  Context,
  DataLayerEventName,
  TikTokPayload,
  UAEventsConnectorConfig,
  UAPayload,
} from '../starter'
import { DestinationPlugin } from './base.plugin'

export class UADestinationPlugin extends DestinationPlugin {
  config: UAEventsConnectorConfig

  constructor() {
    super('ua')
  }

  async processEvent(context: Context): Promise<void> {
    if (!this.shouldProcessEvent(context)) return

    const payload = this.buildPayload(context)
    const ignorePayloadReason = this.ignoreEventReason(context, payload)
    if (ignorePayloadReason) {
      console.log(`Ignoring UA Event: ${ignorePayloadReason}`)
      return
    }

    await this.sendEvent(context, payload)
  }

  protected buildPayload(context: Context): UAPayload {
    const eventName = this.getNormalizedEventName<TikTokPayload['event']>(
      context?.message?.event_name,
    )
    return {
      cid: context?.message?.attributes?._ga,
      uid: context?.message?.attributes?.user_id,
      en: eventName,
      // ? Other event parameters would go here
    }
  }

  protected ignoreEventReason(context: Context, payload: UAPayload): string | undefined {
    if (context?.config?.consentRequired && !context?.message?.attributes?.consentGranted)
      return 'Consent not granted'
    if (!payload.uid && !payload.cid) return 'Missing user identifier'
  }

  protected async sendEvent(context: Context, payload: UAPayload): Promise<void> {
    console.log(`Sending event to UA for property ${context?.config?.ua?.measurementId}`, payload)
  }

  protected eventMap: Partial<Record<DataLayerEventName, ConfigEventKey>> = {
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
}
