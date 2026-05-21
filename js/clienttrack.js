import { liveUpdate } from './globals.js';
import { setClientConfig } from './api.js';

function createObjectHandler(onChange) {
    return {
        set(target, prop, value) {
            const oldValue = target[prop];
            target[prop] = createTrackedValue(value, onChange);
            if (oldValue !== target[prop]) {
                onChange();
            }
            return true;
        },
        deleteProperty(target, prop) {
            const deleted = delete target[prop];
            if (deleted) {
                onChange();
            }
            return deleted;
        }
    };
}

function createArrayHandler(onChange) {
    return {
        set(target, prop, value) {
            const oldValue = target[prop];
            target[prop] = createTrackedValue(value, onChange);
            if (oldValue !== target[prop]) {
                onChange();
            }
            return true;
        },
        deleteProperty(target, prop) {
            const deleted = delete target[prop];
            if (deleted) {
                onChange();
            }
            return deleted;
        }
    };
}

function createTrackedValue(value, onChange) {
    if (value == null || typeof value !== 'object') {
        return value;
    }

    if (Array.isArray(value)) {
        return new Proxy(value.map((item) => createTrackedValue(item, onChange)), createArrayHandler(onChange));
    }

    const result = {};
    Object.entries(value).forEach(([key, item]) => {
        result[key] = createTrackedValue(item, onChange);
    });
    return new Proxy(result, createObjectHandler(onChange));
}

function clonePlain(value) {
    if (value == null || typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(clonePlain);
    }
    const result = {};
    Object.entries(value).forEach(([key, item]) => {
        result[key] = clonePlain(item);
    });
    return result;
}

class LayerWithTracking {
    constructor(data = {}, updater = () => {}) {
        this.ClientUpdater = () => {
            if (liveUpdate && !this.disableUpdates) {
                updater();
            }
        };
        this.disableUpdates = false;
        this.layerID = data.layerID || 0;
        this.animationID = data.animationID || '';
        this.enabled = data.enabled ?? true;
        this.dimmer = data.dimmer ?? 100;
        this.hueShift = data.hueShift ?? 0;
        this.rotate = data.rotate ?? 0;
        this.pan = data.pan ?? 0;
        this.tilt = data.tilt ?? 0;
        this.scale = data.scale ?? 100;
        this.volume = data.volume ?? 1;
        this.shader = data.shader || '';
        this.stretchX = data.stretchX ?? 100;
        this.stretchY = data.stretchY ?? 100;
        this.shaderParameters = createTrackedValue(data.shaderParameters || {}, this.ClientUpdater);
        this.parameters = createTrackedValue(data.parameters || {}, this.ClientUpdater);
        this.textureShaders = createTrackedValue(data.textureShaders || {}, this.ClientUpdater);
        this.textureShaderOrder = createTrackedValue(data.textureShaderOrder || [], this.ClientUpdater);
        return this.createProxy();
    }

    static fromObject(data, updater) {
        return new LayerWithTracking(data, updater);
    }

    createProxy() {
        return new Proxy(this, {
            set: (target, prop, value) => {
                if (prop === 'parameters') {
                    value = createTrackedValue(value, this.ClientUpdater);
                }
                if (prop === 'textureShaders') {
                    value = createTrackedValue(value, this.ClientUpdater);
                }
                if (prop === 'textureShaderOrder') {
                    value = createTrackedValue(value, this.ClientUpdater);
                }
                const oldValue = target[prop];
                target[prop] = value;
                if (prop !== 'ClientUpdater' && oldValue !== target[prop]) {
                    this.ClientUpdater();
                }
                return true;
            },
            deleteProperty: (target, prop) => {
                const deleted = delete target[prop];
                if (deleted) {
                    this.ClientUpdater();
                }
                return deleted;
            }
        });
    }

    toPlainObject() {
        return {
            layerID: this.layerID,
            animationID: this.animationID,
            parameters: clonePlain(this.parameters),
            enabled: this.enabled,
            dimmer: this.dimmer,
            hueShift: this.hueShift,
            rotate: this.rotate,
            pan: this.pan,
            tilt: this.tilt,
            scale: this.scale,
            volume: this.volume,
            shader: this.shader,
            stretchX: this.stretchX,
            stretchY: this.stretchY,
            shaderParameters: clonePlain(this.shaderParameters),
            textureShaders: clonePlain(this.textureShaders),
            textureShaderOrder: clonePlain(this.textureShaderOrder),
        };
    }

    addTextureShader(shaderID, index = this.textureShaderOrder.length) {
        if (index < 0 || index > this.textureShaderOrder.length) {
            throw new Error('Invalid index');
        }
        this.textureShaderOrder.splice(index, 0, shaderID);
        if (!Object.prototype.hasOwnProperty.call(this.textureShaders, shaderID)) {
            this.textureShaders[shaderID] = {};
        }
        this.ClientUpdater();
    }

    removeTextureShader(index) {
        if (index < 0 || index >= this.textureShaderOrder.length) {
            throw new Error('Invalid index');
        }
        this.textureShaderOrder.splice(index, 1);
        this.ClientUpdater();
    }

    reorderTextureShader(newOrder) {
        if (!Array.isArray(newOrder)) {
            throw new Error('The new order must be an array of indices.');
        }
        if (newOrder.length !== this.textureShaderOrder.length) {
            throw new Error('New order must have the same length as the current shaders array.');
        }
        this.textureShaderOrder = newOrder.map((index) => this.textureShaderOrder[index]);
        this.ClientUpdater();
    }
}

class ClientConfigWithTracking {
    constructor(data = {}) {
        this.ClientID = data.ClientID || '';
        this.disableUpdates = false;
        this.dimmer = data.dimmer ?? 0;
        this.hueShift = data.hueShift ?? 0;
        this.rotate = data.rotate ?? 0;
        this.pan = data.pan ?? 0;
        this.tilt = data.tilt ?? 0;
        this.scale = data.scale ?? 0;
        this.stretchX = data.stretchX ?? 0;
        this.stretchY = data.stretchY ?? 0;
        this._layers = [];
        this.layers = data.layers || [];
    }

    static fromObject(data) {
        const instance = new ClientConfigWithTracking(data || {});
        return instance;
    }

    set layers(value) {
        this._layers = Array.isArray(value)
            ? value.map((item) => (item && typeof item.toPlainObject === 'function' ? item : LayerWithTracking.fromObject(item, () => this.sendLive())))
            : [];
    }

    get layers() {
        return this._layers || [];
    }

    async sendLive() {
        if (liveUpdate && !this.disableUpdates) {
            await this.sendClientConfig();
        }
    }

    async sendClientConfig() {
        if (!this.ClientID || this.disableUpdates) {
            return;
        }
        const payload = this.toPlainObject();
        try {
            await setClientConfig(this.ClientID, payload);
        } catch (error) {
            console.error('Error sending client configuration:', error);
        }
    }

    toPlainObject() {
        return {
            layers: this.layers.map((layer) => (layer && typeof layer.toPlainObject === 'function' ? layer.toPlainObject() : clonePlain(layer))),
            dimmer: this.dimmer,
            hueShift: this.hueShift,
            rotate: this.rotate,
            pan: this.pan,
            tilt: this.tilt,
            scale: this.scale,
            stretchX: this.stretchX,
            stretchY: this.stretchY,
        };
    }

    addLayer(layer, index = this.layers.length) {
        const trackedLayer = layer && typeof layer.toPlainObject === 'function' ? layer : LayerWithTracking.fromObject(layer, () => this.sendLive());
        if (index < 0 || index > this.layers.length) {
            throw new Error('Invalid index');
        }
        this._layers.splice(index, 0, trackedLayer);
        this.sendLive();
    }

    removeLayer(index) {
        if (index < 0 || index >= this.layers.length) {
            throw new Error('Invalid index');
        }
        this._layers.splice(index, 1);
        this.sendLive();
    }

    reorderLayers(newOrder) {
        if (!Array.isArray(newOrder)) {
            throw new Error('The new order must be an array of indices.');
        }
        if (newOrder.length !== this.layers.length) {
            throw new Error('New order must have the same length as the current layers array.');
        }
        this._layers = newOrder.map((index) => this.layers[index]);
        this.sendLive();
    }
}

export default ClientConfigWithTracking;
