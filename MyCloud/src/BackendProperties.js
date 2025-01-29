const BackendProperties = {
    BASE_URL: "http://localhost:8089",
    ENDPOINTS: {
        UPLOAD: {
            URI: "/chatAi/upload",
            METHOD: "POST",
        },
        ASK: {
            URI: "/chatAi/ask",
            METHOD: "POST",
        },
        EXTRACT_TEXT:{
            URI:"/extract_text",
            METHOD: "POST",

        },
        GENERATE_EMBEDDING: {
            URI: "/generate_embedding", 
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
