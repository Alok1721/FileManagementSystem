const BackendProperties = {
    BASE_URL: "http://localhost:8089/chatAi",
    ENDPOINTS: {
        UPLOAD: {
            URI: "/upload",
            METHOD: "POST",
        },
        ASK: {
            URI: "/ask",
            METHOD: "POST",
        },
    },

    async callEndpoint(endpoint, options = {}) {
        const { URI, METHOD } = endpoint;
        try {
            const response = await fetch(`${this.BASE_URL}${URI}`, {
                method: METHOD,
                ...options,
            });
            const result = await response.json();
            return { success: response.ok, result };
        } catch (error) {
            console.error("Error calling endpoint:", error);
            return { success: false, result: "Error communicating with the server." };
        }
    },
};

export default BackendProperties;
