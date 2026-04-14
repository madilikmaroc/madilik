import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec(`pm2 logs madilik --lines 100 --nostream`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', data => process.stdout.write(data.toString()));
    stream.stderr.on('data', data => process.stderr.write(data.toString()));
  });
}).on('error', (err) => console.error(err)).connect({
  host: '46.225.175.37', port: 22, username: 'root', password: 'EgcPMwNXU7eN'
});
