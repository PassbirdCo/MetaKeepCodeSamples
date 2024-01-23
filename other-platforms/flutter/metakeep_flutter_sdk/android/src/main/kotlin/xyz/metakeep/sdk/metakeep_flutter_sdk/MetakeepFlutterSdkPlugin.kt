package xyz.metakeep.sdk.metakeep_flutter_sdk

import android.app.Activity
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.MethodChannel.MethodCallHandler
import io.flutter.plugin.common.MethodChannel.Result
import org.json.JSONArray
import org.json.JSONObject
import xyz.metakeep.sdk.*

/** MetaKeepFlutterSdkPlugin */
class MetaKeepFlutterSdkPlugin : FlutterPlugin, MethodCallHandler, ActivityAware {
    // / The MethodChannel that will the communication between Flutter and native Android
    // /
    // / This local reference serves to register the plugin with the Flutter Engine and unregister it
    // / when the Flutter Engine is detached from the Activity
    private lateinit var channel: MethodChannel

    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(flutterPluginBinding.binaryMessenger, "metakeep_flutter_sdk")
        channel.setMethodCallHandler(this)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        currentActivity = binding.activity
    }

    override fun onDetachedFromActivityForConfigChanges() {
        TODO("Not yet implemented")
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        TODO("Not yet implemented")
    }

    override fun onDetachedFromActivity() {
        TODO("Not yet implemented")
    }

    override fun onMethodCall(
        call: MethodCall,
        result: Result,
    ) {
        when (call.method) {
            INITIALIZE_METHOD -> initialize(call, result)
            SET_USER_METHOD -> setUser(call, result)
            SIGN_MESSAGE_METHOD -> signMessage(call, result)
            SIGN_TRANSACTION_METHOD -> signTransaction(call, result)
            SIGN_TYPED_DATA_METHOD -> signTypedData(call, result)
            GET_CONSENT_METHOD -> getConsent(call, result)
            GET_WALLET_METHOD -> getWallet(call, result)
            else -> result.notImplemented()
        }
    }

    private fun initialize(
        call: MethodCall,
        result: Result,
    ) {
        call.argument<String>(APP_ID_FIELD)?.let { appId ->
            sdk = MetaKeep(appId, AppContext(currentActivity!!))
            result.success(null)
        } ?: run {
            rejectWithErrorStatus(
                INVALID_ARGUMENTS_ERROR_STATUS,
                result,
            )
        }
    }

    private fun setUser(
        call: MethodCall,
        result: Result,
    ) {
        // Check user field and then email field in the user object
        val user = call.argument<Map<String, String>>(USER_FIELD)

        if (user == null) {
            rejectWithErrorStatus(
                INVALID_USER_ERROR_STATUS,
                result,
            )
            return
        }

        val email = user[EMAIL_FIELD]

        if (email == null) {
            rejectWithErrorStatus(
                INVALID_ARGUMENTS_ERROR_STATUS,
                result,
            )
            return
        }

        sdk.user = User(email)
    }

    private fun signMessage(
        call: MethodCall,
        result: Result,
    ) {
        val message = call.argument<String>(MESSAGE_FIELD)
        val reason = call.argument<String>(REASON_FIELD)

        if (message == null || reason == null) {
            rejectWithErrorStatus(
                INVALID_ARGUMENTS_ERROR_STATUS,
                result,
            )
            return
        }

        sdk.signMessage(
            message,
            reason,
            getCallback(result),
        )
    }

    private fun signTransaction(
        call: MethodCall,
        result: Result,
    ) {
        val transaction =
            call.argument<
                HashMap<String, Any>,
                >(TRANSACTION_FIELD)
        val reason = call.argument<String>(REASON_FIELD)

        if (transaction == null || reason == null) {
            rejectWithErrorStatus(
                INVALID_ARGUMENTS_ERROR_STATUS,
                result,
            )
            return
        }

        sdk.signTransaction(
            JsonRequest(
                JSONObject(transaction as Map<*, *>?).toString(),
            ),
            reason,
            getCallback(result),
        )
    }

    private fun signTypedData(
        call: MethodCall,
        result: Result,
    ) {
        val typedData =
            call.argument<
                HashMap<String, Any>,
                >(TYPED_DATA_FIELD)
        val reason = call.argument<String>(REASON_FIELD)

        if (typedData == null || reason == null) {
            rejectWithErrorStatus(
                INVALID_ARGUMENTS_ERROR_STATUS,
                result,
            )
            return
        }

        sdk.signTypedData(
            JsonRequest(JSONObject(typedData as Map<*, *>?).toString()),
            reason,
            getCallback(result),
        )
    }

    private fun getConsent(
        call: MethodCall,
        result: Result,
    ) {
        val consentToken = call.argument<String>(CONSENT_TOKEN_FIELD)

        if (consentToken == null) {
            rejectWithErrorStatus(
                INVALID_ARGUMENTS_ERROR_STATUS,
                result,
            )
            return
        }

        sdk.getConsent(
            consentToken,
            getCallback(result),
        )
    }

    private fun getWallet(
        call: MethodCall,
        result: Result,
    ) {
        sdk.getWallet(
            getCallback(result),
        )
    }

    private fun getCallback(result: Result): Callback {
        return Callback(
            onSuccess = { response: JsonResponse ->
                result.success(
                    // Parse JSON data as dynamic map
                    JSONObject(response.data.toString()).toMap(),
                )
            },
            // Pack the actual JSON error response into the error details.
            // This can be extracted in the Flutter side.
            onFailure = { error: JsonResponse ->
                result.error(
                    OPERATION_FAILED_ERROR_STATUS,
                    OPERATION_FAILED_ERROR_STRING,
                    JSONObject(error.data.toString()).toMap(),
                )
            },
        )
    }

    private fun rejectWithErrorStatus(
        errorStatus: String,
        result: Result,
    ) {
        result.error(
            OPERATION_FAILED_ERROR_STATUS,
            OPERATION_FAILED_ERROR_STRING,
            mapOf(STATUS_FIELD to errorStatus),
        )
    }

    private fun JSONObject.toMap(): Map<String, *> =
        keys().asSequence().associateWith { it ->
            when (val value = this[it]) {
                is JSONArray ->
                    {
                        val map = (0 until value.length()).associate { Pair(it.toString(), value[it]) }
                        JSONObject(map).toMap().values.toList()
                    }
                is JSONObject -> value.toMap()
                JSONObject.NULL -> null
                else -> value
            }
        }

    // Holds the MetaKeep SDK instance
    private lateinit var sdk: MetaKeep

    // Holds the current activity
    private lateinit var currentActivity: Activity

    companion object {
        const val NAME = "MetaKeepReactNativeSDK"

        // Methods
        const val INITIALIZE_METHOD = "initialize"
        const val SET_USER_METHOD = "setUser"
        const val SIGN_MESSAGE_METHOD = "signMessage"
        const val SIGN_TRANSACTION_METHOD = "signTransaction"
        const val SIGN_TYPED_DATA_METHOD = "signTypedData"
        const val GET_CONSENT_METHOD = "getConsent"
        const val GET_WALLET_METHOD = "getWallet"

        // Error status
        const val INVALID_ARGUMENTS_ERROR_STATUS = "INVALID_ARGUMENTS"
        const val INVALID_USER_ERROR_STATUS = "INVALID_USER"
        const val OPERATION_FAILED_ERROR_STATUS = "OPERATION_FAILED"

        // Error strings
        const val OPERATION_FAILED_ERROR_STRING = "MetaKeep SDK operation failed"

        // Constant strings
        const val APP_ID_FIELD = "appId"
        const val USER_FIELD = "user"
        const val EMAIL_FIELD = "email"
        const val MESSAGE_FIELD = "message"
        const val TRANSACTION_FIELD = "transaction"
        const val TYPED_DATA_FIELD = "typedData"
        const val REASON_FIELD = "reason"
        const val STATUS_FIELD = "status"
        const val CONSENT_TOKEN_FIELD = "consentToken"
    }
}
