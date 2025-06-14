const { spawn } = require('child_process');
const path = require('path');

// Start React development server
const reactApp = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true
});

// Start Express server
const expressServer = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true
});

// Start Gradio server
const gradioServer = spawn('python', ['../AI doctor/gradio_app.py'], {
    stdio: 'inherit',
    shell: true
});

// Handle process termination
const cleanup = () => {
    reactApp.kill();
    expressServer.kill();
    gradioServer.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup); 