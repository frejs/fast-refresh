const swc = require("@swc/core")

module.exports = function frefresh() {
    return {
        name: 'fre-fresh',
        transfrom: async (code, id) =>{
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

            const runtimecode = `
            const runtime = require('@fre/fast-refresh');
            var prevReg, prevSig;
            prevReg = window.$RefreshReg$ = function(type,id){
                runtime.register(type,id);
            };
            prevSig = window.$RefreshSig$ = runtime.sign;
            try {
                ${code}
            } finally {
                window.$RefreshReg$ = prevReg;
                window.$RefreshSig$ = prevSig;
            };
            `

            return {
                runtimecode,
                map
            }
        }
    }
}