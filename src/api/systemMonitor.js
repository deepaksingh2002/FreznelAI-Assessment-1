const commands = [
  'node server.js',
  'vite --host 0.0.0.0',
  'chrome',
  'firebase emulators:start',
  'typescript-language-server',
  'Code',
];
const users = ['deepak', 'root', 'deepak', 'deepak', 'root', 'deepak'];

export class SystemMonitor {
  tick = 0;

  readSnapshot() {
    this.tick += 1;
    const wave = Math.sin(this.tick / 3);
    const processes = commands.map((command, index) => ({
      pid: 1120 + index * 137,
      command,
      user: users[index],
      cpu: Number(Math.max(0.2, 4 + wave * 2 + index * 1.7).toFixed(1)),
      memory: Number((1.2 + index * 0.8 + Math.abs(wave) * 0.4).toFixed(1)),
      state: index === 2 ? 'sleeping' : index === 4 ? 'idle' : 'running',
    }));

    return {
      uptime: '2d 07:41',
      load: [Number((1.28 + wave * 0.16).toFixed(2)), 1.11, 0.94],
      cpu: Math.round(48 + wave * 9),
      memory: { used: 7.1 + wave * 0.2, total: 16 },
      disk: { used: 237, total: 476 },
      network: { down: Math.round(3.68 + wave * 0.5), up: Math.round(0.42 + wave * 0.08) },
      processes,
    };
  }
}
