// frontend/src/api.js

// A URL base da nossa API virá da variável de ambiente que passamos no deploy.
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Exportamos a URL para que outros arquivos possam usá-la.
export default API_BASE_URL;
