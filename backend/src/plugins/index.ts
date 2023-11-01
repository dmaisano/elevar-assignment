import { Context } from '../starter'
import { DestinationPlugin } from './base.plugin'

export { TikTokDestinationPlugin } from './tiktok.plugin'
export { UADestinationPlugin } from './ua.plugin'

export class PluginManager {
  private plugins: DestinationPlugin[]

  constructor(plugins: DestinationPlugin[]) {
    this.plugins = plugins
  }

  async processEvent(context: Context) {
    for (const plugin of this.plugins) {
      await plugin.processEvent(context)
    }
  }
}
