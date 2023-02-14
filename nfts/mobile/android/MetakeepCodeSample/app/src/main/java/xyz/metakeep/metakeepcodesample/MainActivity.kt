package xyz.metakeep.metakeepcodesample

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var emailEditText: EditText
    private lateinit var submitButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        emailEditText = findViewById(R.id.getNft)
        submitButton = findViewById(R.id.fetchNft)

        submitButton.setOnClickListener {
            val email = emailEditText.text.toString()
            if (isValidEmail(email)) {
                makeApiCall(this@MainActivity, email)
            } else {
                Toast.makeText(this, "Invalid Email ID", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun isValidEmail(email: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun makeApiCall(context: Context, nftOwner: String) {
        val client = OkHttpClient()

        val requestBody = """
    {"of": {"email": "$nftOwner"}}
        """.trimIndent().toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder()
            .url("http://10.0.2.2:3001/getNftTokenList")
            .post(requestBody)
            .header("x-App-Id", "18976e60-7afb-4424-ab37-0bd05fb260d7")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {

                Log.d("INFO", e.message.toString())
                runOnUiThread {
                    Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    Log.d("INFO", response.toString())
                    runOnUiThread {
                        Toast.makeText(context, "Error: ${response.message}", Toast.LENGTH_SHORT)
                            .show()
                    }
                    return
                }

                val jsonObject = JSONObject(response.body?.string() ?: "{}")
                val tokens = jsonObject.get("tokens").toString()
                val intent = Intent(context, ResultActivity::class.java)
                intent.putExtra("result", tokens)
                intent.putExtra("nftOwner", nftOwner)
                startActivity(intent)
            }
        })
    }
    /*

     */
}
