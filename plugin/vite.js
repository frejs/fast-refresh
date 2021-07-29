const swc = require("@swc/core")

module.exports = function frefresh() {
    return {
        name: 'fre-refresh',
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
                prevReg = window.$RefreshReg$ = runtime.register;
                prevSig = window.$RefreshSig$ = runtime.sign; 
            }
            `
            const footer = `
            if (import.meta.hot) {
                window.$RefreshReg$ = prevReg;
                window.$RefreshSig$ = prevSig;
                ${canRefresh(code) ? `import.meta.hot.accept();` : ''}
                runtime.refresh();
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
    // export default must be fre component
    const name = code.match(/^(\s*)export\s+default\s+/m)[0]
    return typeof name === 'string' && name[0] >= 'A' && name[0] <= 'Z'
}
