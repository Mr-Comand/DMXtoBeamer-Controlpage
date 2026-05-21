const BASE_PATH = '/api';

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const text = await response.text();
    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const data = text ? JSON.parse(text) : null;
            if (data && data.error) {
                message = data.error;
            }
        } catch (e) {
            // ignore parse errors
        }
        throw new Error(message);
    }

    return text ? JSON.parse(text) : null;
}

export async function getClientList() {
    return requestJson(`${BASE_PATH}/client/list`);
}

export async function getClient(clientID) {
    return requestJson(`${BASE_PATH}/client/get/${encodeURIComponent(clientID)}`);
}

export async function setClientConfig(clientID, clientConfig) {
    return requestJson(`${BASE_PATH}/client/set/${encodeURIComponent(clientID)}`, {
        method: 'POST',
        body: JSON.stringify(clientConfig),
    });
}

export async function getAnimationList() {
    return requestJson(`${BASE_PATH}/animation/list`);
}

export async function getElementShaderList() {
    return requestJson(`${BASE_PATH}/elementShader/list`);
}

export async function getTextureShaderList() {
    return requestJson(`${BASE_PATH}/textureShader/list`);
}

export async function getAnimationConfig(animationID) {
    return requestJson(`${BASE_PATH}/animation/get/${encodeURIComponent(animationID)}`);
}

export async function getElementShader(shaderID) {
    return requestJson(`${BASE_PATH}/elementShader/get/${encodeURIComponent(shaderID)}`);
}

export async function getTextureShader(shaderID) {
    return requestJson(`${BASE_PATH}/textureShader/get/${encodeURIComponent(shaderID)}`);
}
