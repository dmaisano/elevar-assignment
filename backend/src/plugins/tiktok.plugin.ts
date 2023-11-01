import {
  ConfigEventKey,
  Context,
  DataLayerEventName,
  TikTokEventsConnectorConfig,
  TikTokPayload,
} from '../starter'
import { DestinationPlugin } from './base.plugin'

export class TikTokDestinationPlugin extends DestinationPlugin {
  config: TikTokEventsConnectorConfig

  constructor() {
    super('tiktok')
  }

  async processEvent(context: Context): Promise<void> {
    if (!this.shouldProcessEvent(context)) return

    const payload = this.buildPayload(context)
    const ignorePayloadReason = this.ignoreEventReason(context, payload)
    if (ignorePayloadReason) {
      console.log(`Ignoring TikTok Event: ${ignorePayloadReason}`)
      return
    }

    await this.sendEvent(context, payload)
  }

  protected buildPayload(context: Context): TikTokPayload {
    const eventName = this.getNormalizedEventName<TikTokPayload['event']>(
      context?.message?.event_name,
    )
    return {
      ttid: context?.message?.attributes.ttclid ?? '', // Event shouldn't be sent if missing ttid
      event: eventName,
      // Other event parameters would go here
    }
  }

  protected ignoreEventReason(context: Context, payload: TikTokPayload): string | undefined {
    if (context?.config?.consentRequired && !context?.message?.attributes?.consentGranted)
      return 'Consent not granted'
    if (!payload.ttid) return 'Missing TikTok ID'
  }

  protected async sendEvent(_, payload: TikTokPayload): Promise<void> {
    console.log(`Sending event to TikTok for property ${payload.ttid}`, payload)
  }

  protected eventMap: Partial<Record<DataLayerEventName, ConfigEventKey>> = {
    dl_add_to_cart: 'addToCart',
    dl_sign_up: 'signUp',
  }
}
