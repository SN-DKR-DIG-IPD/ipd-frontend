import { IDefaultConfigAdapter } from "@jbpm/domain";

class DefaultConfigAdapter implements IDefaultConfigAdapter {

    baseUrl ='';
    baseBusinessCentralUrl ='';
    defaultHeader: HeadersInit= {};
	setAPIBaseUrl(url: string): void{
        this.baseUrl = url
    };
	getAPIBaseUrl(): string
    {
        return this.baseUrl
    }
	setDefaultHeaders(headers: HeadersInit): void{
        this.defaultHeader = headers
    }
	getDefaultHeaders(): HeadersInit{
        return this.defaultHeader
    }
    setBusinessCentralAPIBaseUrl(url: string): void {
        this.baseBusinessCentralUrl = url
    }
    getBusinessCentralAPIBaseUrl(): string {
        return this.baseBusinessCentralUrl
    }
}

export {DefaultConfigAdapter}