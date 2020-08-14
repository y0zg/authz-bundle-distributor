'use strict';
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
    app_name: ['authz-bundle-distributor (Staging)'],
    license_key: '',
    logging: {
        level: 'info',
    },
    /**
     * When true, all request headers except for those listed in attributes.exclude
     * will be captured for all traces, unless otherwise specified in a destination's
     * attributes include/exclude lists.
     */
    allow_all_headers: true,
    attributes: {
        /**
         * Prefix of attributes to exclude from all destinations. Allows * as wildcard
         * at end.
         *
         * NOTE: If excluding headers, they must be in camelCase form to be filtered.
         *
         * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
         */
        exclude: [
            'request.headers.cookie',
            'request.headers.authorization',
            'request.headers.proxyAuthorization',
            'request.headers.setCookie*',
            'request.headers.x*',
            'response.headers.cookie',
            'response.headers.authorization',
            'response.headers.proxyAuthorization',
            'response.headers.setCookie*',
            'response.headers.x*',
        ],
    },
    /**
     * Rules for naming or ignoring transactions.
     */
    rules: {
        /**
         * A list of rules of the format {pattern: 'pattern', name: 'name'} for
         * matching incoming request URLs and naming the associated New Relic
         * transactions. Both pattern and name are required. Additional attributes
         * are ignored. Patterns may have capture groups (following JavaScript
         * conventions), and names will use $1-style replacement strings. See
         * the documentation for addNamingRule for important caveats.
         *
         * @env NEW_RELIC_NAMING_RULES
         */
        name: [],
        /**
         * A list of patterns for matching incoming request URLs to be ignored by
         * the agent. Patterns may be strings or regular expressions.
         *
         * By default, socket.io long-polling is ignored.
         *
         * @env NEW_RELIC_IGNORING_RULES
         */
        ignore: ['^/socket.io/.*/xhr-polling/', '/health'],
    },
};
