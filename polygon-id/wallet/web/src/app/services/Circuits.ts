// From: https://github.com/0xPolygonID/extension-demo/blob/main/src/services/CircuitStorage.js
import {
  CircuitId,
  CircuitStorage,
  IndexedDBDataSource,
} from "@0xpolygonid/js-sdk";

export class CircuitStorageInstance {
  static circuitStorage: CircuitStorage;

  static async getCircuitStorage() {
    if (this.circuitStorage) {
      return this.circuitStorage;
    }

    this.circuitStorage = new CircuitStorage(
      new IndexedDBDataSource("circuits")
    );
    try {
      console.time("check loading circuits from DB");
      await this.circuitStorage.loadCircuitData(CircuitId.AuthV2);
      console.timeEnd("check loading circuits from DB");
      return this.circuitStorage;
    } catch (e) {
      console.time("CircuitStorageInstance.init");
      const auth_w = await fetch("./circuits/AuthV2/circuit.wasm")
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      const mtp_w = await fetch(
        "./circuits/credentialAtomicQueryMTPV2/circuit.wasm"
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      const sig_w = await fetch(
        "./circuits/credentialAtomicQuerySigV2/circuit.wasm"
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));

      const auth_z = await fetch("./circuits/AuthV2/circuit_final.zkey")
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      const mtp_z = await fetch(
        "./circuits/credentialAtomicQueryMTPV2/circuit_final.zkey"
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      const sig_z = await fetch(
        "./circuits/credentialAtomicQuerySigV2/circuit_final.zkey"
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));

      const auth_j = await fetch("./circuits/AuthV2/verification_key.json")
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      const mtp_j = await fetch(
        "./circuits/credentialAtomicQueryMTPV2/verification_key.json"
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      const sig_j = await fetch(
        "./circuits/credentialAtomicQuerySigV2/verification_key.json"
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
      console.timeEnd("CircuitStorageInstance.init");
      console.time("CircuitStorageInstance.saveCircuitData");
      await this.circuitStorage.saveCircuitData(CircuitId.AuthV2, {
        circuitId: "authV2".toString(),
        wasm: auth_w,
        provingKey: auth_z,
        verificationKey: auth_j,
      });
      await this.circuitStorage.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
        circuitId: "credentialAtomicQueryMTPV2".toString(),
        wasm: mtp_w,
        provingKey: mtp_z,
        verificationKey: mtp_j,
      });
      await this.circuitStorage.saveCircuitData(CircuitId.AtomicQuerySigV2, {
        circuitId: "credentialAtomicQuerySigV2".toString(),
        wasm: sig_w,
        provingKey: sig_z,
        verificationKey: sig_j,
      });
      console.timeEnd("CircuitStorageInstance.saveCircuitData");
    }

    return this.circuitStorage;
  }
}
