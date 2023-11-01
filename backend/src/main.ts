import { PluginManager } from './plugins'
import { TikTokDestinationPlugin } from './plugins/tiktok.plugin'
import { UADestinationPlugin } from './plugins/ua.plugin'
import { disabledConsentContext, sampleUaTikTokContext } from './samples'

async function main() {
  console.log(`=== start main ===`)
  const uaPlugin = new UADestinationPlugin()
  const tikTokPlugin = new TikTokDestinationPlugin()

  const pluginManager = new PluginManager([tikTokPlugin])
  // await pluginManager.processEvent(sampleUaTikTokContext)
  await pluginManager.processEvent(disabledConsentContext)
  console.log(`=== end main ===`)
}

main().catch(console.error)
