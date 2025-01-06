type GetRequestProps<T, K> = {
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatData?: (data: any) => T;
    params?: K;
    method?: 'POST' | 'PUT' | 'DELETE';
    useMinimumResponseTime?: boolean;
};

type PostRequestProps<T, K> = GetRequestProps<T, K> & {
    body?: KeyType;
};

type KeyType = {[key: string]: string | number | boolean | null | undefined};

class Network {
    private static _minumumResponseTime = 500;
    private static _headers = () => {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
    };

    private static createUrl<K extends KeyType = KeyType>(params?: K): string {
        if (params) {
            return `?${Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join('&')}`;
        } else {
            return '';
        }
    }

    static async get<T, K extends KeyType = KeyType>({
        url,
        formatData,
        params,
        useMinimumResponseTime,
    }: GetRequestProps<T, K>): Promise<T | null> {
        const urlToCall = `${url}${this.createUrl<K>(params)}`;
        try {
            const currentMS1 = new Date().getTime();
            const response = await fetch(urlToCall, {
                method: 'GET',
                headers: {
                    ...this._headers(),
                },
            });
            if (useMinimumResponseTime) {
                const currentMS2 = new Date().getTime();
                const timeTaken = currentMS2 - currentMS1;
                if (timeTaken < Network._minumumResponseTime) {
                    await new Promise(resolve =>
                        setTimeout(
                            resolve,
                            Network._minumumResponseTime - timeTaken,
                        ),
                    );
                }
            }
            if (!response.ok || !response) {
                return null;
            }
            const data = await response.json();
            if (formatData) {
                return formatData(data);
            }
            return data as T;
            //@typescript-eslint/no-unused-vars
        } catch (err) {
            return null;
        } finally {
        }
    }

    static async post<T, K extends KeyType = KeyType>({
        body,
        url,
        formatData,
        params,
        method = 'POST',
        useMinimumResponseTime,
    }: PostRequestProps<T, K>): Promise<T | null> {
        const urlToCall = `${url}${this.createUrl<K>(params)}`;
        try {
            const resToken = await fetch('http://localhost:8000/test/csrf');
            const currentMS1 = new Date().getTime();
            const response = await fetch(urlToCall, {
                method: method,
                body: JSON.stringify(body),
                headers: {
                    ...this._headers(),
                    'X-CSRF-TOKEN': `${await resToken.text()}`,
                },
            });
            if (useMinimumResponseTime) {
                const currentMS2 = new Date().getTime();
                const timeTaken = currentMS2 - currentMS1;
                if (timeTaken < Network._minumumResponseTime) {
                    await new Promise(resolve =>
                        setTimeout(
                            resolve,
                            Network._minumumResponseTime - timeTaken,
                        ),
                    );
                }
            }
            if (!response.ok || !response) {
                return null;
            }
            const data = await response.json();
            if (formatData) {
                return formatData(data);
            }
            return data as T;
        } catch (err) {
            //@typescript-eslint/no-unused-vars
            return null;
        } finally {
        }
    }
}

export default Network;
