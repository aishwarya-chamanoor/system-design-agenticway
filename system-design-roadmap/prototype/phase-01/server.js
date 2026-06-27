const http = require("http");
const fs = require("fs").promises;
const path = require("path");

async function readStore(){
    try{
        const raw = await fs.readFile(path.join(__dirname, "data.json"), "utf-8");
        return JSON.parse(raw);
    } catch (err) {
       if(err.code === "ENOENT") return {};  // file doesn't exist yet → empty store
       console.log(err);
    }
}

async function writeStore(data){
    await fs.writeFile(path.join(__dirname, "data.json"), JSON.stringify(data,null,2));
}

function getBody(req){
    return new Promise((resolve) => {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => resolve(body));
    });
}

let activeConnections = 0;

const server = http.createServer(async (req,res) => {
    res.setHeader("content-type", "application/json");
    const parts = req.url.split("/");
    const key = parts[2];
    if(req.url == '/stats'){
       const memUsage = process.memoryUsage().rss /1024/1024;
       const activeHandles = process._getActiveHandles().length;
       var start = Date.now();
       const eventLoopLag = setTimeout(() => {
        const lag =  Date.now() - start;
        res.end(JSON.stringify({
            memory_mb: memUsage,
            active_handles: activeHandles,
            connections: activeConnections,
            event_loop_lag_ms: lag
        }));
        }, 0);
      // res.end(JSON.stringify({memusage : memUsage, activeHandles : activeHandles, eventLoopLag : eventLoopLag}));
    } else if (req.url.startsWith("/data/") && key) {
        if (req.method === "PUT") {
            const body = await getBody(req);
            const parsed = JSON.parse(body);
            const store = await readStore();
            store[key] = parsed.value;
            await writeStore(store);
            res.end(JSON.stringify({ key: key, value: parsed.value }));
        } else if (req.method === "GET") {
            const store = await readStore();
            if (store[key] !== undefined) {
                res.end(JSON.stringify({ key: key, value: store[key] }));
            } else {
                res.writeHead(404, { "content-type": "application/json" });
                res.end(JSON.stringify({ error: "not found" }));
            }
        } else {
            res.writeHead(405, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "method not allowed" }));
        }
    } else if (req.url === '/heavy') {
        // Simulate CPU-intensive work (e.g., hash computation, image processing)
        const start = Date.now();
        while (Date.now() - start < 5000) {} // Block for 5 seconds
        res.end(JSON.stringify({ blocked_ms: Date.now() - start }));
    } 
    else {
        res.end(JSON.stringify({status: "alive"}));
    }
});

server.on("connection", (socket) =>{
    activeConnections++;
    socket.on("close", () => {
        activeConnections--;
    });
});

server.listen(3000, () => {
    console.log("Server is running on 3000");
});