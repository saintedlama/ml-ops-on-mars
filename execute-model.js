const { spawn } = require("child_process");

const path = require("path");

module.exports = function (input, next) {
  // Naive approach - spawn a process for each request
  const modelProcess = spawn("python", [path.join(__dirname, "models", "model2.py")], {
    shell: false,
  });

  let stdout = "";
  let stderr = "";

  modelProcess.stdout.on("data", (data) => (stdout += data));
  modelProcess.stderr.on("data", (data) => (stderr += data));

  modelProcess.on("close", (code) => {
    if (modelProcess.killed) {
      return next(new Error("model timeout"));
    }

    if (code != 0) {
      return next(new Error(`model execution exited with code ${code}. [stdout] ${stdout}, [stderr]: ${stderr}`));
    }

    // TODO: This is a bit a whacky parsing - should be a line
    const idx = stdout.indexOf("result:");
    if (idx < 0) {
      throw new Error(`received a malformed response from model ${stdout}`);
    }

    try {
      const resultJsonStr = stdout.substr(idx + "result:".length);

      return next(null, JSON.parse(resultJsonStr));
    } catch (e) {
      return next(new Error(`received a malformed JSON from model ${stdout} with error ${e}`));
    }
  });

  modelProcess.on("error", (error) => console.log("error", error));

  modelProcess.stdin.end(JSON.stringify(input));
  modelProcess.stdin.on("error", (err) => console.log("could not write to stdin of model", err));

  setTimeout(() => modelProcess.kill("SIGTERM"), 10 * 1000);
};
