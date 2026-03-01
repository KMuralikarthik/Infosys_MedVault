export const safeJSONParse = (value, fallback = null) => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        console.error("JSON Parse error:", e);
        return fallback;
    }
};
