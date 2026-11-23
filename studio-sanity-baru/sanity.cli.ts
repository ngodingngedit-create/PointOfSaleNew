import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'aejzrj0n',
    dataset: 'production'
  },
  deployment: {
    appId: 'ywlhcqw5c94cm7q8fjkm7ex1',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
