import Analytics from 'analytics'
import googleAnalytics from 'analytics-plugin-ga'
import segmentPlugin from 'analytics-plugin-segment'
import doNotTrack from 'analytics-plugin-do-not-track'
import tabEvents from 'analytics-plugin-tab-events'
import windowEvents from 'analytics-plugin-window-events'
import customerIoPlugin from 'analytics-plugin-customerio'
import gtagManager from 'analytics-plugin-google-tag-manager'
import hubspotPlugin from 'analytics-plugin-hubspot'
import simpleAnalyticsPlugin from 'analytics-plugin-simple-analytics'
import originalSourcePlugin from 'analytics-plugin-original-source'
import exampleProviderPlugin from './plugins/provider-example'
import visualizeLifecycle from './plugins/visualize-analytics'
import crazyEgg from 'analytics-plugin-crazy-egg'

const reduxPlugin = store => next => action => {
  if (action.type === 'page:segment') {
    console.log('Other one!')
  }
  return next(action)
}

// window.doNotTrack = '1'

var tabInterval

/* initialize analytics and load plugins */
const analytics = Analytics({
  debug: true,
  plugins: [
    /*{
      // If already has anonymousId use it
      NAMESPACE: 'set-anon-id',
      setItemStart: (data) => {
        console.log('data', data)
        const { payload, instance } = data
        if (payload.key === '__anon_id') {
          const { storage } = instance
          // Check for segment ajs_anonymous_id cookie
          const anonId = storage.getItem('ajs_anonymous_id', 'cookie')
          if (anonId) {
            // Override autogenerated anon id
            return {
              ...payload,
              ...{
                value: anonId.replace(/^%22/g, '').replace(/%22$/g, '')
              }
            }
          }
        }
      }
    },*/

    originalSourcePlugin(),
    // {
    //   NAMESPACE: 'react-to-original-src',
    //   setOriginalSource: ({ payload }) => {
    //     console.log('original action set', payload)
    //   },
    // },
    visualizeLifecycle(),
    // crazyEgg({
    //   accountNumber: '00840000'
    // }),
    tabEvents(),
    // windowEvents(),
    // doNotTrack(),
    // simpleAnalyticsPlugin(),
    // customerIoPlugin({
    //   siteId: '4dfdba9c7f1a6d60f779',
    //   disableAnonymousTraffic: true,
    // }),
    // segmentPlugin({
    //   writeKey: 'TpKoFHqy1g98bXjd3wdVp3JvkHJRl5Q5',
    //   disableAnonymousTraffic: true,
    // }),
    exampleProviderPlugin({
      settingOne: 'xyz'
    }),
    // hubspotPlugin({
    //   portalId: '24787'
    // }),
    /*
    gtagManager({
      containerId: 'GTM-N5P4NK5'
    }),
    */
    googleAnalytics({
      trackingId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    }),
    reduxPlugin,
    /*{
      NAMESPACE: 'custom',
      tabHidden: () => {
        console.log('TAB HIDDEN')
        var tabHiddenCount = 0
        tabInterval = setInterval(() => {
          console.log(tabHiddenCount++)
        }, 500)
      },
      tabVisible: () => {
        console.log('Tab Now visible again')
        clearInterval(tabInterval)
      },
      tabHiddenEnd: () => {
        console.log('TAB HIDDEN Last')
      }
    },
    {
      NAMESPACE: 'custom-two',
      tabHidden: () => {
        console.log('TAB HIDDEN 2')
      },
      tabHiddenEnd: () => {
        console.log('TAB HIDDEN Last 2')
      }
    }*/
  ]
})

window.Analytics = analytics

/* export analytics for usage through the app */
export default analytics
