package com.example.metakeepcodesample

import android.content.Intent
import android.util.Patterns
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.android.material.imageview.ShapeableImageView
import org.json.JSONObject

class MyAdapter(private val nftList: ArrayList<Nfts>): RecyclerView.Adapter<MyAdapter.MyViewHolder>() {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {

        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.nft_list_fragment, parent, false)

        return MyViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val currentItem = nftList[position]
        holder.nftTitle.text = currentItem.nftTitle.substring(0,20) + "..."
        val metadata = currentItem.metadata as JSONObject
        Glide.with(holder.itemView.context).load(metadata.getString("image")).into(holder.titleImage)
        holder.button.setOnClickListener {
            val email = holder.recieverEmail.text.toString()
            if (isValidEmail(email))
            {
                val intent = Intent(holder.itemView.context, CallSdkActivity::class.java)
                intent.putExtra("email", email)
                intent.putExtra("from_email",currentItem.nftOwner )
                intent.putExtra("nftTitle", currentItem.nftTitle)
                intent.putExtra("metadata", currentItem.metadata.toString())
                holder.itemView.context.startActivity(intent)
            }
            else {
                Toast.makeText(holder.itemView.context, "Invalid Email ID", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun getItemCount(): Int {
        return nftList.size
    }

    private fun isValidEmail(email: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }



    class MyViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){

        var titleImage: ShapeableImageView = itemView.findViewById(R.id.nftImage)
        var nftTitle: TextView= itemView.findViewById(R.id.nftId)
        var button: Button = itemView.findViewById(R.id.nftTransfer)
        var recieverEmail : EditText = itemView.findViewById(R.id.recieverEmail)

    }


}