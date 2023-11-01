import { TikTokDestinationPlugin } from './plugins/tiktok.plugin'
import { UADestinationPlugin } from './plugins/ua.plugin'
import { sampleUaTikTokContext } from './samples'

async function main() {
  console.log(`=== start main ===`)
  const uaPlugin = new UADestinationPlugin(sampleUaTikTokContext)
  await uaPlugin.processEvent()
  const tikTokPlugin = new TikTokDestinationPlugin(sampleUaTikTokContext)
  await tikTokPlugin.processEvent()
  console.log(`=== end main ===`)
}

main().catch(console.error)
