const cluster = require("cluster");
const { cpus } = require("os");

// Return true or false
// console.log(cluster.isPrimary);
// console.log(cluster.isWorker);


// if (cluster.isPrimary) {
//   console.log("Primary process. Generating worker process", process.pid);

//   // Number of threads that will be able to process these multiprocessing
//   const cores = cpus().length;
//   console.log("Cores =>", cores);
//   cluster.fork();
//   cluster.fork();
//   cluster.fork();
//   cluster.fork();
// } else {
//   console.log("isPrimary=false. I'm a worker =>", process.pid);
//   process.disconnect();
// }




// Cluster creation using for & cores number
if (cluster.isPrimary) {
  console.log("Primary process. Generating worker process", process.pid);
  const cores = cpus().length;
  console.log("Cores =>", cores);
  for (let i = 0; i < cores; i++) {
    cluster.fork();
  }
} else {
  console.log("isPrimary=false. I'm a worker =>", process.pid);
  process.disconnect();
}
