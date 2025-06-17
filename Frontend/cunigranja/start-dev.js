// start-dev.js
const os = require('os');
const { exec } = require('child_process');

// Encuentra la IP local de la red Wi-Fi o Ethernet
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost'; // fallback
}

const ip = getLocalIp();
console.log(`🚀 Iniciando Next.js en http://${ip}:3000`);

const cmd = `npx next dev --hostname 0.0.0.0`;
const child = exec(cmd);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
