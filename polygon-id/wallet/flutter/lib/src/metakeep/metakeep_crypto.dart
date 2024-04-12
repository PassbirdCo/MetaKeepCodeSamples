import 'dart:typed_data';

import 'package:flutter/services.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:polygonid_flutter_sdk/common/domain/domain_logger.dart';
import 'package:polygonid_flutter_sdk/common/utils/uint8_list_utils.dart';
import 'package:polygonid_flutter_sdk/identity/libs/bjj/bjj.dart';
import 'package:polygonid_flutter_sdk/identity/libs/bjj/bjj_wallet.dart';
import 'package:polygonid_flutter_sdk/identity/data/data_sources/wallet_data_source.dart';
import 'package:polygonid_flutter_sdk/identity/libs/bjj/eddsa_babyjub.dart';
import 'package:polygonid_flutter_sdk/sdk/polygon_id_sdk.dart';
import 'package:metakeep_flutter_sdk/metakeep_flutter_sdk.dart';
import 'package:polygonid_flutter_sdk_example/src/common/app_logger.dart';
import 'package:polygonid_flutter_sdk/common/utils/hex_utils.dart';
import 'package:web3dart/crypto.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:logger/logger.dart';

final logger = Logger();

class MetaKeepWalletLib extends WalletLibWrapper {
  // Holds the MetaKeep SDK instance.
  late MetaKeep _metakeepSdk;

  // Holds the BjjWallet instance.
  BjjWallet? _bjjWallet;

  MetaKeepWalletLib(String appId, String? email) {
    logger.i("MetaKeepWalletLib constructor");

    if (appId.isEmpty) {
      throw ArgumentError("appId cannot be empty");
    }

    _metakeepSdk = MetaKeep(appId);

    // Set user if email is provided
    if (email != null && email.isNotEmpty) {
      _metakeepSdk.setUser({"email": email}).onError((error, stacktrace) =>
          logger.e("Error setting user: $error", stackTrace: stacktrace));
    }
  }

  // Create a new wallet using MetaKeep SDK.
  // MetaKeep doesn't support creating wallets with a secret.
  // So, we are not using the secret parameter here.
  // @param [Uint8List] secret - secret key which is not used here
  // @returns [BjjWallet] - Babyjubjub wallet instance
  Future<BjjWallet> createWallet({Uint8List? secret}) async {
    logger.i("MetaKeepWalletLib.createWallet");

    return _getMetaKeepWallet();
  }

  // Get wallet using MetaKeep SDK
  // MetaKeep doesn't support getting wallets using a private key.
  // So, we are not using the privateKey parameter here.
  // @param [Uint8List] privateKey - private key which is not used here
  // @returns [BjjWallet] - Babyjubjub wallet instance
  Future<BjjWallet> getWallet({required Uint8List privateKey}) async {
    logger.i("MetaKeepWalletLib.getWallet");

    return _getMetaKeepWallet();
  }

  /// Signs message with the MetaKeep SDK
  /// @param [String] privateKey - privateKey which is not used here
  /// @param [String] message - message to sign
  /// @returns [String] - Babyjubjub signature packed and encoded as an hex string
  Future<String> signMessage(
      {required Uint8List privateKey, required String message}) async {
    logger.i("MetaKeepWalletLib.signMessage: message: $message");

    // Check if message is a hex string until we add support for hex strings
    if (message.toLowerCase().startsWith("0x")) {
      throw ArgumentError(
          "Hex string message not supported, please use BigInt string");
    }

    // MetaKeep expects bigint to be sent as a big-endian hex string
    // So we convert message to big-endian hex string
    BigInt parsedMessage = BigInt.parse(message, radix: 10);

    final beBytes =
        Uint8ArrayUtils.bigIntToBytes(parsedMessage).reversed.toList();
    final beHex = HexUtils.bytesToHex(beBytes,
        padToEvenLength: true, forcePadLength: 64, include0x: true);

    // Sign message using MetaKeep SDK
    final signMessageResponse = await _metakeepSdk.signMessage(
        beHex, // Signing reason. This can be customized to your application.
        "create/verify a credential(update this message to your application's needs)");

    // Return the signature without the 0x prefix
    return HexUtils.strip0x(signMessageResponse["signature"]);
  }

  Future<BjjWallet> _getMetaKeepWallet() async {
    // Get wallet from MetaKeep SDK
    if (_bjjWallet != null) {
      return Future.value(_bjjWallet);
    }

    // Get wallet from MetaKeep SDK
    final wallet = await _metakeepSdk.getWallet();

    String publicKey = wallet["wallet"]["publicKey"];

    // Create a new BjjWallet instance
    _bjjWallet = MetaKeepBjjWallet(publicKey);
    return _bjjWallet!;
  }
}

/// MetaKeep implementation of BjjWallet
/// This class is used to create a Babyjubjub wallet using MetaKeep SDK.
/// Since MetaKeep hardware wallet doesn't support import or export of private keys,
/// we return a DUMMY private key instead. This DUMMY private key is only used for
/// encryption and decryption of data in the app by the PolygonID SDK.
class MetaKeepBjjWallet implements BjjWallet {
  final DUMMY_PRIVATE_KEY = Uint8List(32);

  MetaKeepBjjWallet(String publicKeyCompressedHex) {
    // Dummy private key
    privateKey = DUMMY_PRIVATE_KEY;

    // PublicKey
    publicKey = newFromCompressed(publicKeyCompressedHex);
  }

  /// Create a PublicKey from a compressed public key
  ///
  /// @param {String} publicKeyCompressedHex - compressed public key in hex format
  ///
  /// @returns {List<String>} - public key as a list of BigInt strings
  static List<String> newFromCompressed(String publicKeyCompressedHex) {
    final uncompressedPoint =
        BabyjubjubLib().unpackPoint(HexUtils.strip0x(publicKeyCompressedHex));
    if (uncompressedPoint == null) {
      throw ArgumentError('unpackPoint failed');
    }

    BigInt x = BigInt.parse(uncompressedPoint[0]);
    BigInt y = BigInt.parse(uncompressedPoint[1]);

    List<BigInt> point = [];
    point.add(x);
    point.add(y);

    final publicKey = PublicKey(point);
    return [publicKey.p[0].toString(), publicKey.p[1].toString()];
  }

  @override
  late Uint8List privateKey;

  @override
  late List<String> publicKey;

  @override
  String? publicKeyBase64;

  @override
  String? publicKeyCompressed;

  @override
  String? publicKeyCompressedHex;

  @override
  dynamic publicKeyHex;

  @override
  String hashMessage(
      String claimsTreeRoot, String revocationTree, String rootsTreeRoot) {
    throw UnimplementedError();
  }
}
