const loadJsonData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`Error loading JSON data from ${url}: ${error}`);
        return null;
    }
};