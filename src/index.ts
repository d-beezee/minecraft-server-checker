import { InvalidArgumentError, program } from 'commander';

import { StatusChecker } from './StatusChecker';

program
    .requiredOption('-s, --server <server>', 'Server address and port', (value) => {
        const [address, port] = value.split(":");
        if (!address || !port || isNaN(parseInt(port))) {
            throw new InvalidArgumentError("Invalid server address and port");
        }
        return value;
    })
    .parse();


const main = async () => {
    const { server } = program.opts();

    const statusChecker = new StatusChecker(server);

    statusChecker.checkStatus().then((status) => {
        console.log(status);
        process.exit(0);
    }).catch(() => {
        process.exit(1);
    });

}

main();