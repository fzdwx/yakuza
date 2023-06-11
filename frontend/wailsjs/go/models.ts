export namespace applications {
	
	export class Application {
	    name: string;
	    icon: string;
	    Exec: string;
	    terminal: boolean;
	    count: number;
	    lastRunTime: number;
	
	    static createFrom(source: any = {}) {
	        return new Application(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.icon = source["icon"];
	        this.Exec = source["Exec"];
	        this.terminal = source["terminal"];
	        this.count = source["count"];
	        this.lastRunTime = source["lastRunTime"];
	    }
	}

}

