export class API {
    constructor() {
        this.BASE_URL = "https://byte-tasks.herokuapp.com/api";
    }

    async findErrors(response) {
        if(!response.ok) {
            const { details } = await response.json();

            throw new Error("Error", { cause: details });
        }

        return response;
    }

    async sendRequest(url, options) {
        const response = await this.findErrors(await fetch(url, options));

        if (response.status === 204) {
            return;
        }

        const result = await response.json();
        return result;
    }

    async loginRequest(body) {
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
        };
        
        const login = await this.sendRequest(`${this.BASE_URL}/auth/login`, options);

        return login;
    }

    async registerRequest(body) {
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
        };
        
        const register = await this.sendRequest(`${this.BASE_URL}/auth/register`, options);

        return register;
    }

    async selfRequest(token) {
        const options = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };
          
        const self = await this.sendRequest(`${this.BASE_URL}/auth/user/self`, options);

        return self;
    }

    async taskGetRequest(token) {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
          };
          
        const tasks = await this.sendRequest(`${this.BASE_URL}/task`, options);

        return tasks;
    }

    async taskPostRequest({ token, body }) {
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body,
        };
          
        const task = await this.sendRequest(`${this.BASE_URL}/task`, options);

        return task;
    }

    async taskIdDeleteRequest({ token, taskId }) {
        const options = {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
        };
        
        await this.sendRequest(`${this.BASE_URL}/task/${taskId}`, options);
    }

    async taskFinishedRequest({ token, taskId, body }) {
        const options = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body,
        };
          
        const task = await this.sendRequest(`${this.BASE_URL}/task/${taskId}`, options);

        return task;
    }

    async taskCountRequest({ token, taskId, body }) {
        const options = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body,
        };
          
        const task = await this.sendRequest(`${this.BASE_URL}/task/${taskId}`, options);

        return task;

    }

    placeholderRequest() {
        return "placeholder";
    }
}