/**
 * Parsely plugin
 * @link https://getanalytics.io/plugins/parsely/
 * @link https://parsely.com/
 * @link https://developers.parsely.com
 * @param {object} pluginConfig - Plugin settings
 * @param {string} pluginConfig.apiKey - Parsely project API key
 * @param {object} pluginConfig.options - Parsely SDK options
 * @return {*}
 * @example
 *
 * parselyPlugin({
 *   apiKey: 'token',
 *   options: {
 *   }
 * })
 */
function parselyPlugin(pluginConfig = {}) {
	// Parsely client instance.
	let client = null;
	// Flag is set to true after parsely client instance is initialized.
	let parselyInitCompleted = false;

	const initComplete = (d) => {
		client = d;
		parselyInitCompleted = true;
	};

	return {
		name: "parsely",
		config: pluginConfig,
		initialize: ({ config }) => {
			const { apiKey, options = {} } = config
			if (!apiKey) {
				throw new Error("Parsely project API key is not defined")
			}
			if (options && typeof options !== "object") {
				throw new Error("Parsely SDK options must be an object")
			}

			// Already loaded.
			if (typeof window.PARSELY !== 'undefined') {
				return;
			}

			// Initialize parsely script.
			window.addEventListener('load', () => {
				var parsely=window.PARSELY=window.PARSELY||{
					autotrack: false,
					onload: function() {
						console.log("Parse.ly loaded.");
						initComplete(PARSELY);
					}
				};
				if(parsely._snippetVersion="1.0.0",!parsely.loaded)if(parsely._snippetInvoked)try{window.console&&console.error&&console.error("Parsely snippet included twice")}catch(e){}else{parsely._snippetInvoked=!0,parsely._stubs={onStart:[]},parsely._buildStub=function(e){return function(){parsely._stubs[e].push(arguments)}};for(var curStub in parsely._stubs)parsely._stubs.hasOwnProperty(curStub)&&(parsely[curStub]=parsely._buildStub(curStub))}parsely._load=function(e,s){s=void 0===s?"cdn.parsely.com":s;var r=document.createElement("script");r.id="parsely-cfg",r.type="text/javascript",r.async=!0,r.setAttribute("data-parsely-site",e),r.src="//"+s+"/keys/"+e+"/p.js",document.body.appendChild(r)};

				parsely._load(apiKey);
			})
		},

		page: ({ payload: { properties, options } }) => {
		let eventType = "Page View"
		if (options && options.eventType) {
			eventType = options.eventType
		}
			client.logEvent(eventType, properties)
		},

		track: ({ payload: { event, properties } }) => {
			client.beacon.trackPageView({
			url: "target url",
			urlref: location.href, // current url
			js: 1,
			action: "_" . event, // the event string which is passed
			data: properties // payload
		});
		},

		identify: ({payload}) => {
			let {apiKey, userId} = payload.traits;
			fetch(`https://api.parsely.com/v2/profile?apikey=${apiKey}&url=${window.location.href}}&uuid=${userId}`)
			.then(response => response.json())
			.then(data => data)
			.catch((data) => {
				console.log("Failure: ");
				console.log(data);
			})
		},

		methods: {

			async user(payload) {
				let {apiKey, requiredData, userId} = payload;
				switch (requiredData) {
					case 'history':
						let response = await fetch(`https://api.parsely.com/v2/history?apikey=${apiKey}&uuid=${userId}`);
						let data = await response.json();
						return data;
					default:
						return "No such data available";
				}
			}

		},

		loaded: () => parselyInitCompleted,
	}
}

export default parselyPlugin;
