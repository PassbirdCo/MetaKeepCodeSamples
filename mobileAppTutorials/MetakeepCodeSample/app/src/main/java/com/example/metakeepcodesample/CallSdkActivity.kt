package com.example.metakeepcodesample

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import xyz.metakeep.sdk.AppContext
import xyz.metakeep.sdk.Environment
import xyz.metakeep.sdk.MetaKeep
import java.io.IOException


class CallSdkActivity : AppCompatActivity() {

    private lateinit var metakeepsdk : MetaKeep

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_call_sdk)
        metakeepsdk = MetaKeep(appId = "18976e60-7afb-4424-ab37-0bd05fb260d7", AppContext(this))
        metakeepsdk.environment = Environment.DEVELOPMENT
        val metadata = JSONObject(intent.getStringExtra("metadata"))
        val nftName = findViewById<TextView>(R.id.tv_card_name)
        val image = findViewById<ImageView>(R.id.iv_card_image)
        Glide.with(this).load(metadata.getString("image")).into(image)
        nftName.text = metadata.getString("name")

        val confirmTransfer = findViewById<Button>(R.id.confirm_button)

        confirmTransfer.setOnClickListener {
            transferNft(
                intent.getStringExtra("email").toString(),
                intent.getStringExtra("nftTitle").toString()
            )
        }
    }
    private fun transferNft(email: String, tokenId: String) {
        val client = OkHttpClient()

        val requestBody = """
    {"token": "$tokenId", "to": {"email": "$email"}, "from": {"email": "${intent.getStringExtra("from_email")}"}}
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
                if(jsonObject.get("status") == "USER_CONSENT_NEEDED")
                {
                    metakeepsdk.getConsent(
                        jsonObject.get("consentToken").toString(),
                        xyz.metakeep.sdk.Callback(
                            onFailure = {},
                            onSuccess = {},
                        ),
                    )
                    finish()
                }
            }

        })

    }
}