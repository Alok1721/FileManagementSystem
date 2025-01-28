import BackendProperties from "../BackendProperties";

export const uploadFile = async (file) => {
    if (!file) {
        return { success: false, message: "Please select a PDF file." };
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await BackendProperties.callEndpoint(BackendProperties.ENDPOINTS.UPLOAD, {
        body: formData,
    });

    if (response.success && response.result.message) {
        return { success: true, message: response.result.message };
    } else {
        return { success: false, message: response.result.message || "Upload failed." };
    }
};

export const askQuestion = async (question) => {
    if (!question.trim()) {
        return { success: false, response: "Please enter a question." };
    }

    const response = await BackendProperties.callEndpoint(BackendProperties.ENDPOINTS.ASK, {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
    });

    if (response.success) {
        return { success: true, response: response.result.response || "I couldn't find an answer to that." };
    } else {
        return { success: false, response: response.result || "Error getting response from the assistant." };
    }
};
