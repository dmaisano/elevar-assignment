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

  constructor(context: Context) {
    super(context, 'UA')
  }

  async processEvent(): Promise<void> {
    if (!this.shouldProcessEvent()) {
      console.log(`!shouldProcessEvent()`)
      return
    }

    const payload = this.buildPayload()
    const ignorePayloadReason = this.ignoreEventReason(payload)
    if (ignorePayloadReason) {
      console.log(`Ignoring UA Event: ${ignorePayloadReason}`)
      return
    }

    await this.sendEvent(payload)
  }

  protected buildPayload(): UAPayload {
    const eventName = this.getNormalizedEventName<TikTokPayload['event']>(
      this?.context?.message?.event_name,
    )
    return {
      cid: this.context?.message?.attributes?._ga,
      uid: this.context?.message?.attributes?.user_id,
      en: eventName,
      // ? Other event parameters would go here
    }
  }

  protected ignoreEventReason(payload: UAPayload): string | undefined {
    if (this.context?.config?.consentRequired && !this.context?.message?.attributes?.consentGranted)
      return 'Consent not granted'
    if (!payload.uid && !payload.cid) return 'Missing user identifier'
  }

  protected async sendEvent(payload: UAPayload): Promise<void> {
    console.log(
      `Sending event to UA for property ${this.context?.config?.ua?.measurementId}`,
      payload,
    )
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
