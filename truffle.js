module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    dev1: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    dev2: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    dev3: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }
  }
};