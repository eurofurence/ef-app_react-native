const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
    env.babel = {
        dangerouslyAddModulePathsToTranspile: ["usehooks-ts", "@openspacelabs/react-native-zoomable-view"],
    };

    return await createExpoWebpackConfigAsync(env, argv);
};
