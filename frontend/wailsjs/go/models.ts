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
	export class RunHistoryItem {
	    name: string;
	    cmd: string;
	    terminal: boolean;
	    count: number;
	    lastRunTime: number;
	
	    static createFrom(source: any = {}) {
	        return new RunHistoryItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.cmd = source["cmd"];
	        this.terminal = source["terminal"];
	        this.count = source["count"];
	        this.lastRunTime = source["lastRunTime"];
	    }
	}
	export class RunHistory {
	    apps: RunHistoryItem[];
	    shell: RunHistoryItem[];
	
	    static createFrom(source: any = {}) {
	        return new RunHistory(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.apps = this.convertValues(source["apps"], RunHistoryItem);
	        this.shell = this.convertValues(source["shell"], RunHistoryItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

