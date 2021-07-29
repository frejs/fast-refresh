const swc = require("@swc/core")

module.exports = async function frefresh() {
    return {
        name: 'fre-fresh',
        transfrom(code, id) {
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

            return {
                code,
                map
            }

        }
    }
}