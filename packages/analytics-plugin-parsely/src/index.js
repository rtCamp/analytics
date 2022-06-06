import clientSide from './browser'
import serverSide from './node'

/* This module will shake out unused code + work in browser and node 🎉 */
export default process.browser ? clientSide : serverSide