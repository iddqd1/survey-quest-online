export class HttpService {
  baseUrl: string;

  constructor(baseURL = "http://localhost:8000") {
    this.baseUrl = baseURL;
  }
  get defaultHeaders() {
    return {
      Authorization: `Token ${localStorage.getItem("Authorization")}`,
      "Content-Type": "application/json",
    };
  }

    async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: { ...this.defaultHeaders, ...headers },
        });
    
        if (!response.ok) {
        throw new Error(`GET request failed with status ${response.status}`);
        }
    
        return response.json();
    }

    async post<T>(endpoint: string, body: any, headers: HeadersInit = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { ...this.defaultHeaders, ...headers },
        body: JSON.stringify(body),
        });
    
        if (!response.ok) {
        throw new Error(`POST request failed with status ${response.status}`);
        }
    
        return response.json();
    }
    async put<T>(endpoint: string, body: any, headers: HeadersInit = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: { ...this.defaultHeaders, ...headers },
        body: JSON.stringify(body),
        });
    
        if (!response.ok) {
        throw new Error(`PUT request failed with status ${response.status}`);
        }
    
        return response.json();
    }
    async delete<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: { ...this.defaultHeaders, ...headers },
        });
    
        if (!response.ok) {
        throw new Error(`DELETE request failed with status ${response.status}`);
        }
    
        return response.json();
    }
    async patch<T>(endpoint: string, body: any, headers: HeadersInit = {}): Promise<T> {    
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...headers },
        body: JSON.stringify(body),
        });
    
        if (!response.ok) {
        throw new Error(`PATCH request failed with status ${response.status}`);
        }
    
        return response.json();
    }
    async uploadFile<T>(endpoint: string, file: File, headers: HeadersInit = {}): Promise<T> {  
        const formData = new FormData();
        formData.append("file", file);
    
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { ...this.defaultHeaders, ...headers },
        body: formData,
        });
    
        if (!response.ok) {
        throw new Error(`File upload failed with status ${response.status}`);
        }
    
        return response.json();
    }
    async downloadFile(endpoint: string, headers: HeadersInit = {}): Promise<Blob> {    
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: { ...this.defaultHeaders, ...headers },
        });
    
        if (!response.ok) {
        throw new Error(`File download failed with status ${response.status}`);
        }
    
        return response.blob();
    }
    async fetchWithRetry<T>(endpoint: string, options: RequestInit, retries = 3): Promise<T> {  
        let lastError: Error | null = null;
    
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
    
                return response.json();
            } catch (error) {
                lastError = error as Error;
            }
        }
    
        throw lastError || new Error("Max retries exceeded");
    }

}
