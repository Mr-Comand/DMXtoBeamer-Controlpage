import { shadersApi, animationsApi } from "./globals.js";

export let Animations = {};
export let TextureShaders = {};
export let ElementShaders = {};

export async function pullStaticData() {
    try {
        const elementShadersPromise = new Promise((resolve, reject) => {
            shadersApi.apiElementShaderListGet((error, data, response) => {
                if (error) {
                    console.error("Error fetching Element Shaders:", error);
                    reject(error);
                    return;
                }
                if (data) {
                    ElementShaders = data
                }
                resolve();
            });
        });

        const textureShadersPromise = new Promise((resolve, reject) => {
            shadersApi.apiTextureShaderListGet((error, data, response) => {
                if (error) {
                    console.error("Error fetching Texture Shaders:", error);
                    reject(error);
                    return;
                }
                if (data) {
                    TextureShaders = data
                }
                resolve();
            });
        });

        const animationsPromise = new Promise((resolve, reject) => {
            animationsApi.apiAnimationListGet((error, data, response) => {
                if (error) {
                    console.error("Error fetching Animations:", error);
                    reject(error);
                    return;
                }
                if (data) {
                    Animations = data
                }
                resolve();
            });
        });

        await Promise.all([elementShadersPromise, textureShadersPromise, animationsPromise]);
        console.log("All static data successfully fetched and stored.");
    } catch (error) {
        console.error("Error fetching static data:", error);
    }
}
