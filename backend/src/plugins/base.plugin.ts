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
  protected readonly pluginType: 'ua' | 'tiktok'
  protected abstract eventMap: Partial<Record<DataLayerEventName, ConfigEventKey>>

  constructor(type: 'ua' | 'tiktok') {
    this.pluginType = type
  }

  abstract processEvent(context: Context): Promise<void>

  protected shouldProcessEvent(context: Context): boolean {
    let config = context.config[this.pluginType]
    const isEnabled = Boolean(context?.config && config?.live)
    if (!isEnabled) return false

    if (this.pluginType === 'ua' && !(config as UAEventsConnectorConfig)?.measurementId)
      return false

    const eventName = this.eventMap[context?.message?.event_name] || null
    if (!eventName) {
      console.log(
        `Event type "${context?.message?.event_name}" not supported for "${this.pluginType} plugin"`,
      )
      return false
    }

    let shouldProcessEvent: boolean
    try {
      shouldProcessEvent = !!config?.enabledEvents[eventName]
    } catch {
      return false
    }

    return shouldProcessEvent
  }

  protected abstract buildPayload(context: Context): PluginPayloadType

  protected abstract ignoreEventReason(
    context: Context,
    payload: PluginPayloadType,
  ): string | undefined

  protected abstract sendEvent(context: Context, payload: PluginPayloadType): Promise<void>

  protected getNormalizedEventName<T = UAPayload['en'] | TikTokPayload['event']>(
    sourceEventName: DataLayerEventName,
  ): T {
    return this.eventMap[sourceEventName] as T // ? If this function has been called we assume the event to exist in the mapping
  }
}
