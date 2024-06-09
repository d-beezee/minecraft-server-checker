import fs from 'fs';
import * as serverInfo from 'minecraft-server-util';

export class StatusChecker {
    private address: string;
    private port: number;

    private _oldStatus: "0" | "1" = "0";

    constructor(url: string) {
        const [address, port] = (url).split(":");
        this.address = address
        this.port = parseInt(port);

        if (!fs.existsSync("isOnline")) {
            fs.writeFileSync("isOnline", "0");
        }

        this._oldStatus = fs.readFileSync("isOnline", "utf8") as "0" | "1";
    }


    get oldStatus() {
        return this._oldStatus;
    }

    set oldStatus(value: "0" | "1") {
        this._oldStatus = value;
        fs.writeFileSync("isOnline", value);
    }


    private async isOnline() {
        return new Promise((resolve, reject) => {
            serverInfo
                .status(this.address, this.port) //default port: 25565
                .then((response) => {
                    if (
                        response.version.name.includes("Offline") ||
                        response.version.name.includes("Loading")
                    ) {
                        reject("Server is offline!");
                    }
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };


    public async checkStatus(): Promise<"online" | "offline" | "unchanged"> {
        try {
            const response = await this.isOnline();
            if (this.oldStatus === "0") {
                this.oldStatus = "1";
                return "online";
            }
            return "unchanged";
        } catch (error) {
            if (this.oldStatus === "1") {
                this.oldStatus = "0"
                return "offline";
            }
            return "unchanged";
        }
    }


}