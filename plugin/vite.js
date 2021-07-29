const swc = require("@swc/core")

module.exports = function frefresh() {
    return {
        name: 'fre-fresh',
        transfrom: async (code, id) => {
            if (!/\.(t|j)sx?$/.test(id) || id.includes('node_modules')) {
                return
            }

            const { code, map } = await swc.transfrom(code, {
                jsc: {
                    parser: {
                        syntax: "typescript",
                        tsx: true
                    },
                    sourceMaps: true,
                    target: "es2016",
                    transform: {
                        react: {
                            pragma: "h",
                            refresh: true,
                            development: true,
                            useBuiltins: true
                        }
                    }
                }
            })

            const header = `
            const runtime = require('@fre/fast-refresh');
            var prevReg, prevSig;
            
            if (import.meta.hot) {
                prevReg = window.$RefreshReg$ = function(type,id){
                    runtime.register(type, ${JSON.stringify(id)} + " " + id);
                };
                prevSig = window.$RefreshSig$ = runtime.sign; 
            }
            `
            const footer = `
            if (import.meta.hot) {
                window.$RefreshReg$ = prevReg;
                window.$RefreshSig$ = prevSig;
                ${canRefresh(code) ? `import.meta.hot.accept();` : ''}
                if (!window.vite_fre_plugin_timeout) {
                    window.vite_fre_plugin_timeout = setTimeout(() => {
                        window.vite_fre_plugin_timeout = 0;
                        runtime.refresh();
                    }, 30);
                  }
            }
            `

            return {
                code: `${header}${code}${footer}`,
                map
            }
        }
    }
}

function canRefresh(code) {
    // every export must be fre component
    return true
}