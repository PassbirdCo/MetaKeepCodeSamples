package xyz.metakeep.metakeepcodesample

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.* // ktlint-disable no-wildcard-imports
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var emailInput: EditText
    private lateinit var submitButton: Button
    private val tag = "MainActivity"
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        emailInput = findViewById(R.id.email_input)
        submitButton = findViewById(R.id.fetchNft)

        submitButton.setOnClickListener {
            val email = emailInput.text.toString()
            if (isValidEmail(email)) {
                makeApiCall(this@MainActivity, email)
            } else {
                Toast.makeText(this, "Invalid Email ID", Toast.LENGTH_SHORT).show()
            }
        }

        progressBar = findViewById(R.id.progressBar)
    }

    private fun isValidEmail(email: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun makeApiCall(context: Context, nftOwner: String) {
        val client = OkHttpClient()

        val requestBody = """
        {
            "of": 
                {
                    "email": "$nftOwner"
                }
        }
        """.trimIndent().toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        val request =
            Request.Builder().url("http://10.0.2.2:3001/getNftTokenList").post(requestBody).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                progressBar.visibility = ProgressBar.INVISIBLE

                Log.e(tag, e.message.toString())
                runOnUiThread {
                    Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                progressBar.visibility = ProgressBar.INVISIBLE

                if (!response.isSuccessful) {
                    Log.e(tag, response.toString())
                    runOnUiThread {
                        Toast.makeText(context, "Error: ${response.message}", Toast.LENGTH_SHORT)
                            .show()
                    }
                    return
                }

                val jsonObject = JSONObject(response.body?.string() ?: "{}")
                val tokens = jsonObject.get("tokens").toString()
                val intent = Intent(context, NftListActivity::class.java)
                intent.putExtra("result", tokens)
                intent.putExtra("nftOwner", nftOwner)
                startActivity(intent)
            }
        })

        // Show loader
        progressBar.visibility = ProgressBar.VISIBLE
    }
}
