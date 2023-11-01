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

  constructor(context: Context) {
    super(context, 'TikTok')
  }

  async processEvent(): Promise<void> {
    if (!this.shouldProcessEvent()) return

    const payload = this.buildPayload()
    const ignorePayloadReason = this.ignoreEventReason(payload)
    if (ignorePayloadReason) {
      console.log(`Ignoring TikTok Event: ${ignorePayloadReason}`)
      return
    }

    await this.sendEvent(payload)
  }

  protected shouldProcessEvent(): boolean {
    const isEnabled = Boolean(this.config && this.config?.live)
    if (!isEnabled) return false

    const eventName = this.eventMap[this.context?.message?.event_name]
    if (!eventName) return false
    const shouldProcessEvent = !!this.config?.[eventName]

    return shouldProcessEvent
  }

  protected buildPayload(): TikTokPayload {
    const eventName = this.getNormalizedEventName<TikTokPayload['event']>(
      this?.context?.message?.event_name,
    )
    return {
      ttid: this.context?.message?.attributes.ttclid ?? '', // Event shouldn't be sent if missing ttid
      event: eventName,
      // Other event parameters would go here
    }
  }

  protected ignoreEventReason(payload: TikTokPayload): string | undefined {
    if (this.context?.config?.consentRequired && !this.context?.message?.attributes?.consentGranted)
      return 'Consent not granted'
    if (!payload.ttid) return 'Missing TikTok ID'
  }

  protected async sendEvent(payload: TikTokPayload): Promise<void> {
    console.log(`Sending event to TikTok for property ${payload.ttid}`, payload)
  }

  protected eventMap: Partial<Record<DataLayerEventName, ConfigEventKey>> = {
    dl_add_to_cart: 'addToCart',
    dl_login: 'login',
  }
}
