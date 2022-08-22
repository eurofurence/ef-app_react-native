const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
    env.babel = {
        dangerouslyAddModulePathsToTranspile: ["@openspacelabs/react-native-zoomable-view", "@gorhom/bottom-sheet"],
    };

    return await createExpoWebpackConfigAsync(env, argv);
};
