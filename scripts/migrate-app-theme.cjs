const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../src/pages");

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const orbBlock =
  /\s*{\/\* Animated background elements \*\/}[\s\S]*?<\/div>\s*\n\s*\n/g;
const orbBlock2 =
  /\s*{\/\* Decorative gradient orbs \*\/}[\s\S]*?<\/div>\s*\n\s*\n/g;
const netLine = /\s*<NetworkBackground\s*\/>\s*\n/g;
const netComment = /\s*{\/\* Network Background[^*]*\*\/}\s*\n/g;

for (const file of walk(root)) {
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("NetworkBackground") && !s.includes("AppBackground")) continue;
  if (!s.includes("NetworkBackground")) continue;

  s = s.replace(/NetworkBackground/g, "AppBackground");
  s = s.replace(netComment, "\n");
  s = s.replace(netLine, "\n      <AppBackground />\n");
  s = s.replace(orbBlock, "\n");
  s = s.replace(orbBlock2, "\n");
  s = s.replace(
    /min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden/g,
    "app-resend min-h-screen flex flex-col relative overflow-hidden"
  );
  s = s.replace(
    /min-h-screen bg-bg-secondary flex flex-col/g,
    "app-resend min-h-screen flex flex-col relative overflow-hidden"
  );

  if (!s.includes("app-resend-content")) {
    s = s.replace(
      /(<AppBackground \/>)\s*\n(\s*)<Header/,
      '$1\n$2<div className="app-resend-content flex flex-col flex-1">\n$2<Header'
    );
    const last = s.lastIndexOf("\n    </div>\n  );");
    if (last !== -1) {
      s = s.slice(0, last) + "\n      </div>" + s.slice(last);
    }
  }

  fs.writeFileSync(file, s);
  console.log("updated", file);
}
