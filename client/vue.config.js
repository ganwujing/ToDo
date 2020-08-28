// vue.config.js for less-loader@6.0.0
module.exports = {
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#FF9933',
                        'link-color': '#FF9933',
                        'border-radius-base': '2px',
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
};