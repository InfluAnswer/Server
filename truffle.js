module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x5862b1766dE4Bee24adCE5A4C5eAb2b38f620DC2", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 470000 // Gas limit used for deploys
    }
  }
};
