import { getElementShaderList, getTextureShaderList, getAnimationList } from './api.js';

export let Animations = {};
export let TextureShaders = {};
export let ElementShaders = {};

export async function pullStaticData() {
    try {
        const elementShadersPromise = getElementShaderList().then((data) => {
            if (data) {
                ElementShaders = data;
            }
        });

        const textureShadersPromise = getTextureShaderList().then((data) => {
            if (data) {
                TextureShaders = data;
            }
        });

        const animationsPromise = getAnimationList().then((data) => {
            if (data) {
                Animations = data;
            }
        });

        await Promise.all([elementShadersPromise, textureShadersPromise, animationsPromise]);
        console.log('All static data successfully fetched and stored.');
    } catch (error) {
        console.error('Error fetching static data:', error);
    }
}
