import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaTwitter } from "../target/types/solana_twitter";
import * as assert from "assert";
describe("solana-twitter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

  it("can send a new tweet", async () => {    
    const tweet = anchor.web3.Keypair.generate();
    const wallet = (program.provider as anchor.AnchorProvider).wallet;
    await program.methods.sendTweet('veganism', 'Hummus, am I right?').accounts({
      tweet: tweet.publicKey,
        author: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([tweet])
    .rpc();
    
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
  	console.log("tweet Account", tweetAccount);    
  });

  it('can fetch all tweets', async () => {
    const tweetAccounts = await program.account.tweet.all();
    console.log("tweets", tweetAccounts);
    assert.equal(tweetAccounts.length, 1);
});


});
