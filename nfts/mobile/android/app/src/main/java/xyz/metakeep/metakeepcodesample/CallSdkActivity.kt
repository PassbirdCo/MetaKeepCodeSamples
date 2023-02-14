package xyz.metakeep.metakeepcodesample

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import okhttp3.* // ktlint-disable no-wildcard-imports
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import xyz.metakeep.sdk.AppContext
import xyz.metakeep.sdk.Environment
import xyz.metakeep.sdk.MetaKeep
import java.io.IOException

class CallSdkActivity : AppCompatActivity() {

    private lateinit var metakeepsdk: MetaKeep

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_call_sdk)
        metakeepsdk = MetaKeep(appId = "5430bdc0-ece6-45bd-8025-21dbfe0329c5", AppContext(this))
        metakeepsdk.environment = Environment.PRODUCTION
        val metadata = JSONObject(intent.getStringExtra("metadata").toString())
        val nftName = findViewById<TextView>(R.id.tv_card_name)
        val image = findViewById<ImageView>(R.id.iv_card_image)
        val email = findViewById<EditText>(R.id.recieverEmail).text
        Glide.with(this).load(metadata.getString("image")).into(image)
        nftName.text = metadata.getString("name")

        val confirmTransfer = findViewById<Button>(R.id.confirm_button)

        confirmTransfer.setOnClickListener {

            if (isValidEmail(email.toString())) {
                transferNft(
                    email.toString(),
                    intent.getStringExtra("nftTitle").toString()
                )
            } else {
                Toast.makeText(this, "Invalid Reciever Email ID", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun isValidEmail(email: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun transferNft(email: String, tokenId: String) {
        val client = OkHttpClient()

        val requestBody = """
    {"token": "$tokenId", "to": {"email": "$email"}, "from": {"email": "${intent.getStringExtra("fromEmail")}"}}
        """.trimIndent().toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        val request = Request.Builder()
            .url("http://10.0.2.2:3001/getConsentToken")
            .post(requestBody)
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .build()

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
                    metakeepsdk.getConsent(
                        jsonObject.get("consentToken").toString(),
                        xyz.metakeep.sdk.Callback(
                            onFailure = { finish() },
                            onSuccess = {
                                val intent = Intent(this@CallSdkActivity, MainActivity::class.java)
                                startActivity(intent)
                                finish()
                            },
                        ),
                    )
                }
            }
        })
    }
}
