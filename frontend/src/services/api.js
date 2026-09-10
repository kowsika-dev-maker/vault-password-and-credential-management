import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api"
});

// =========================================================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// =========================================================

API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// =========================================================
// RESPONSE INTERCEPTOR
// Convert backend/network errors into user-friendly messages
// =========================================================

API.interceptors.response.use(

    // Successful response
    (response) => {
        return response;
    },

    // Error response
    (error) => {

        let message =
            "Something went wrong. Please try again.";

        // -----------------------------------------------------
        // SERVER / NETWORK ERROR
        // -----------------------------------------------------

        if (!error.response) {

            message =
                "Unable to connect to SecureVault. Please check that the server is running.";

        } else {

            const status =
                error.response.status;

            const data =
                error.response.data;

            // -------------------------------------------------
            // BAD REQUEST
            // -------------------------------------------------

            if (status === 400) {

                message =
                    data?.message ||
                    "Please check the information you entered.";
            }

            // -------------------------------------------------
            // UNAUTHORIZED
            // -------------------------------------------------

            else if (status === 401) {

                message =
                    data?.message ||
                    "Your session is invalid or has expired.";
            }

            // -------------------------------------------------
            // FORBIDDEN
            // -------------------------------------------------

            else if (status === 403) {

                message =
                    data?.message ||
                    "You are not authorized to perform this action.";
            }

            // -------------------------------------------------
            // NOT FOUND
            // -------------------------------------------------

            else if (status === 404) {

                message =
                    data?.message ||
                    "The requested resource was not found.";
            }

            // -------------------------------------------------
            // CONFLICT
            // -------------------------------------------------

            else if (status === 409) {

                message =
                    data?.message ||
                    "This operation could not be completed because of a conflict.";
            }

            // -------------------------------------------------
            // SERVER ERROR
            // -------------------------------------------------

            else if (status >= 500) {

                message =
                    "SecureVault is temporarily unable to process your request. Please try again.";
            }
        }

        // Store friendly message inside Axios error
        error.userMessage = message;

        return Promise.reject(error);
    }
);


export default API;