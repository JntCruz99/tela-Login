const { exec } = require('child_process');
const chokidar = require('chokidar');
const WebSocket = require('ws');

function startServer() {
    
    console.log('Iniciando o servidor BrowserSync...');
    exec('browser-sync start --server --files "*.html,css/*.css"', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao iniciar o servidor: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro ao iniciar o servidor: ${stderr}`);
            return;
        }
        console.log(`Servidor BrowserSync iniciado com sucesso:\n${stdout}`);
    });

    const wss = new WebSocket.Server({ port: 3000 });
    console.log('Servidor WebSocket iniciado na porta 3000');


    const watcher = chokidar.watch(['*.html', 'css/*.css']);
    watcher.on('change', () => {
        
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('reload');
            }
        });
    });
}

startServer();
