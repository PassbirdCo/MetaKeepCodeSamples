# NFT frontend

This project is the nft frontend website. The users can see list of the tokens they own and transfer them to some other addresses.

## How to run this Application.

### Put the API key and Collection ID in the `/backend/.env`

### Open a new terminal and go to the `nfts/backend` directory

Run the following command to start the backend server

```node index.js```

This will start serving a server at localhost:3001. 

### Open a new terminal and go to the `nfts/frontend` directory

Run the following command to start the frontend application

```npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

You can put all the details in the TransferNFT form such as token ID, from, and to

`from` is the email ID of the user on behalf of whom you need to send token to.

`to` is the email ID of the nft reciever.

## Learn More

You can learn more in the [MetaKeep REST API documentation](https://docs.metakeep.xyz).
