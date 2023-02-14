package xyz.metakeep.metakeepcodesample

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.* // ktlint-disable no-wildcard-imports
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import okhttp3.* // ktlint-disable no-wildcard-imports
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import xyz.metakeep.sdk.AppContext
import xyz.metakeep.sdk.MetaKeep
import java.io.IOException
import java.util.* // ktlint-disable no-wildcard-imports
import kotlin.concurrent.schedule

class TransferNftActivity : AppCompatActivity() {

    private lateinit var metaKeepSdk: MetaKeep
    private val tag = "TransferNftActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_transfer_nft)
        metaKeepSdk = MetaKeep(appId = "9cc98bca-da35-4da8-8f10-655b3e51cb9e", AppContext(this))
        val metadata = JSONObject(intent.getStringExtra("metadata").toString())
        val nftName = findViewById<TextView>(R.id.nft_name)
        val image = findViewById<ImageView>(R.id.nft_image)
        val email = findViewById<EditText>(R.id.receiverEmail).text
        Glide.with(this).load(metadata.getString("image")).into(image)
        nftName.text = metadata.getString("name")

        val confirmTransfer = findViewById<Button>(R.id.confirm_button)

        confirmTransfer.setOnClickListener {

            if (isValidEmail(email.toString())) {
                transferNft(
                    email.toString(), intent.getStringExtra("nftTitle").toString()
                )
            } else {
                Toast.makeText(this, "Invalid receiver email", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun isValidEmail(email: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun transferNft(email: String, tokenId: String) {
        val client = OkHttpClient()

        val requestBody = """
        {
          "token": "$tokenId",
          "to": {
            "email": "$email"
          },
          "from": {
            "email": "${intent.getStringExtra("fromEmail")}"
          }
        }
        """.trimIndent().toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        val request =
            Request.Builder().url("http://10.0.2.2:3001/getConsentToken").post(requestBody)
                .header("Content-Type", "application/json").header("Accept", "application/json")
                .header("Access-Control-Allow-Origin", "*").build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {

                Log.d("INFO", e.message.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    Log.d("INFO", response.toString())

                    return
                }
                val jsonObject = JSONObject(response.body?.string() ?: "{}")
                if (jsonObject.get("status") == "USER_CONSENT_NEEDED") {
                    metaKeepSdk.getConsent(
                        jsonObject.get("consentToken").toString(),
                        xyz.metakeep.sdk.Callback(
                            onFailure = {
                                Log.e(tag, "Error: $it")

                                Toast.makeText(
                                    this@TransferNftActivity, "Error: $it", Toast.LENGTH_LONG
                                ).show()
                            },
                            onSuccess = {
                                Log.d(tag, "Success: $it")

                                Toast.makeText(
                                    this@TransferNftActivity,
                                    "NFT transferred successfully. Navigating to home in 3 seconds",
                                    Toast.LENGTH_LONG
                                ).show()

                                // Redirect to home page and destroy all activities on the stack

                                val intent =
                                    Intent(this@TransferNftActivity, MainActivity::class.java)
                                intent.flags =
                                    Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK

                                // Wait for 3 seconds before redirecting
                                Timer().schedule(3000) {
                                    startActivity(intent)
                                    finish()
                                }
                            },
                        ),
                    )
                }
            }
        })
    }
}
