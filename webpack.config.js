const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
    env.babel = {
        dangerouslyAddModulePathsToTranspile: ["usehooks-ts"],
    };

    return await createExpoWebpackConfigAsync(env, argv);
};
