import {
  ConfigEventKey,
  Context,
  DataLayerEventName,
  TikTokEventsConnectorConfig,
  TikTokPayload,
  UAEventsConnectorConfig,
  UAPayload,
} from '../starter'

export type DestinationConfig =
  | UAEventsConnectorConfig
  | TikTokEventsConnectorConfig
  | null
  | undefined

export type PluginPayloadType = UAPayload | TikTokPayload

export abstract class DestinationPlugin {
  protected readonly context: Context
  protected readonly config: DestinationConfig
  protected readonly pluginType: 'UA' | 'TikTok'
  protected abstract eventMap: Partial<Record<DataLayerEventName, ConfigEventKey>>

  constructor(context: Context, type: 'UA' | 'TikTok') {
    this.context = context
    this.pluginType = type
    if (this.pluginType === 'UA') this.config = context?.config?.ua
    if (this.pluginType === 'TikTok') this.config = context?.config?.tiktok
  }

  abstract processEvent(): Promise<void>

  protected shouldProcessEvent(): boolean {
    const isEnabled = Boolean(this.config && this.config?.live)
    if (!isEnabled) return false

    if (this.pluginType === 'UA' && !(this.config as UAEventsConnectorConfig)?.measurementId)
      return false

    const eventName = this.eventMap[this.context?.message?.event_name]
    if (!eventName) return false

    const shouldProcessEvent = !!this.config?.enabledEvents[eventName]
    return shouldProcessEvent
  }

  protected abstract buildPayload(): PluginPayloadType

  protected abstract ignoreEventReason(payload: PluginPayloadType): string | undefined

  protected abstract sendEvent(payload: PluginPayloadType): Promise<void>

  protected getNormalizedEventName<T = UAPayload['en'] | TikTokPayload['event']>(
    sourceEventName: DataLayerEventName,
  ): T {
    return this.eventMap[sourceEventName] as T // ? If this function has been called we assume the event to exist in the mapping
  }
}
