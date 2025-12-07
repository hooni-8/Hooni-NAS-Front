const CracoAlias = require('craco-alias')

module.exports = {
	plugins: [
		{
			plugin: CracoAlias,
			options: {
				source: 'options',
				baseUrl: './',
				aliases: {
					'@assets': './src/assets',
					'@components': './src/components',
					'@layout': './src/layout',
					'@nav': './src/nav',
					'@pages': './src/pages',
					'@styles': './src/styles',
				},
			},
		},
	],
}
