import baseURL from "../config/baseURL";

interface FetchLinkParams {
    address: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    bodyData?: Record<string, any> | FormData | null;
    others?: RequestInit;
    autoHeaders?: boolean;
    loadingOn?: () => void;
    loadingOff?: () => void;
}

export const fetchLink = async <T = any>({
    address,
    method = "GET",
    headers = {},
    bodyData = null,
    others = {},
    autoHeaders = false,
    loadingOn,
    loadingOff,
}: FetchLinkParams): Promise<T> => {
    const storageStr = localStorage.getItem("user");
    const storage = storageStr ? JSON.parse(storageStr) : null;
    const token = storage?.Autheticate_Id;

    const isFormData = bodyData instanceof FormData;

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: token ?? "",
    };

    const finalHeaders = autoHeaders
        ? defaultHeaders
        : { ...defaultHeaders, ...headers };

    const options: RequestInit = {
        method,
        headers: finalHeaders,
        ...others,
    };

    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
        if (!isFormData) {
            options.body = JSON.stringify(bodyData || {});
        } else {
            options.body = bodyData as FormData; // FormData should not be stringified
        }
    }

    try {
        if (loadingOn) loadingOn();

        const response = await fetch(baseURL + address.replace(/\s+/g, ""), options);

        if (finalHeaders["Content-Type"] === "application/json") {
            const json: T = await response.json();
            return json;
        } else {
            // Return raw response if not JSON
            return (response as unknown) as T;
        }
    } catch (e) {
        console.error("Fetch Error", e);
        throw e;
    } finally {
        if (loadingOff) loadingOff();
    }
};
