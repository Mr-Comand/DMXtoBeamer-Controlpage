import { ApiClient, AnimationsApi, ClientsApi, ShadersApi, Layer, ClientConfig } from '../../javascript-client-generated/src/index.js';
import {liveUpdate, apiClient, clientsApi} from './globals.js'


const proxies = new WeakSet();

export function createFindableProxy(target, handler) {
    const proxy = new Proxy(target, handler);
    proxies.add(proxy);
    return proxy;
}
export function isProxy(obj) {
    console.log(proxies.has(obj))
    return proxies.has(obj);
}


// Subclass of ClientConfig to track changes
class ClientConfigWithTracking extends ClientConfig {
    constructor() {
        super(); // Call the parent class constructor
        // Wrap the layers array in a Proxy to track changes
        this._layers = [];
        this.ClientID = "";
        this.disableUpdates = false;

        return this.createProxy(this);

    }
    set layers(value) {
        // if (value && Array.isArray(value)) {
        //     value = value.map(layer => {
        //         if (isProxy(layer)) {
        //             return layer;
        //         }
        //         const client = this
        //         return createFindableProxy(layer, {
        //             set(target, property, value) {
        //                 console.log(`Layer property '${property}' changed to`, value);
        //                 target[property] = value; // Apply the change to the layer
        //                 client.sendLive(client)
        //                 return true; // Indicate that the operation was successful
        //             }
        //         });
        //     });
        // }
        // Proxy the layers array itself
        this._layers = value
    }

    get layers() {
        return this._layers;
    }

    trackLayerChanges(layer) {
        return createFindableProxy(layer, {
            set(target, prop, value) {
                console.log(`Layer property '${prop}' changed to`, value);
                target[prop] = value;
                return true;
            }
        });
    }
    // Override the necessary methods to track changes if needed
    // Use Proxy for tracking changes
    // Override the constructFromObject method to track changes on the layers array and other properties
    static constructFromObject(data) {
        let instance = new ClientConfigWithTracking();
        instance.disableUpdates = true
        if (data.layers == null) {
            data.layers = []
        }
        instance = super.constructFromObject(data, instance); // Call the parent method to construct the object

        // Wrap the 'layers' array in a Proxy to track changes
        if (instance.layers && Array.isArray(instance.layers)) {
            instance.layers = instance.layers.map(layer => {
                return createFindableProxy(layer, {
                    set(target, property, value) {
                        console.log(`Layer property '${property}' changed to`, value);
                        target[property] = value; // Apply the change to the layer
                        instance.sendLive(instance)
                        return true; // Indicate that the operation was successful
                    }
                });
            });
        }
        instance.disableUpdates = false
        // Wrap the rest of the properties in a Proxy to track changes
        return instance
    }
    // Create Proxy for the whole ClientConfig object
    createProxy(target) {
        return createFindableProxy(target, {
            set: (obj, prop, value) => {
                if (prop === 'layers' || prop in obj) {
                    console.log(`Property '${prop}' changed to:`, value);
                    this.sendLive(obj); // Send updated config if liveUpdate is enabled
                }
                obj[prop] = value;
                return true;
            }
        });
    }
    async sendLive(clientConfig) {
        if  (liveUpdate){
            this.sendClientConfig(clientConfig)
        }
    }

    // Function to send updated client config
    async sendClientConfig(clientConfig) {
        if (!clientConfig) {
            clientConfig = this
        }
        if (clientConfig.ClientID != undefined && clientConfig.ClientID != "" && !clientConfig.disableUpdates) {
            console.log("sending update")
            
                let send = ClientConfig.constructFromObject(clientConfig)
                send.layers = clientConfig._layers
            
            await new Promise((resolve, reject) => {
                clientsApi.apiClientSetClientIDPost(send, this.ClientID, (error, data, response) => {
                    if (error) {
                        handelError(error);
                        reject(error);
                        return;
                    }
                    resolve(data);
                });
            });
        }
        else {
            console.log("disable")
        }
    }

    // Add a layer at a specific index
    addLayer(layer, index = this._layers.length) {
        if (index < 0 || index > this._layers.length) {
            throw new Error("Invalid index");
        }
        if (!isProxy(layer)) {
            const client = this
            layer = createFindableProxy(layer, {
                set(target, property, value) {
                    console.log(`Layer property '${property}' changed to`, value);
                    target[property] = value; // Apply the change to the layer
                    client.sendLive(client)
                    return true; // Indicate that the operation was successful
                }
            });
        }

        this._layers.splice(index, 0, layer);  // Insert layer at the specified index
        this.sendLive()

        console.log(`Layer added at index ${index}`);
    }

    // Remove a layer by index
    removeLayer(index) {
        if (index < 0 || index >= this._layers.length) {
            throw new Error("Invalid index");
        }
        this._layers.splice(index, 1);  // Remove the layer at the specified index
        this.sendLive()
        console.log(`Layer removed at index ${index}`);
    }

    // Reorder layers by the given order (array of indices)
    reorderLayers(newOrder) {
        if (!Array.isArray(newOrder)) {
            throw new Error("The new order must be an array of indices.");
        }

        if (newOrder.length !== this._layers.length) {
            throw new Error("New order must have the same length as the current layers array.");
        }

        const reorderedLayers = newOrder.map(index => this._layers[index]);
        this._layers = reorderedLayers;  // Set the layers to the new order
        this.sendLive()
        console.log(`Layers reordered:`, newOrder);
    }
}


export default ClientConfigWithTracking;