# Create a Merkle Tree using NodeJS

## What are Merkle Trees?

Although the name sounds a bit corny in my opinion, Merkles are a form of cryptographic data structure used commonly in the Web3 ( blockchain ) space. A Merkle Tree, also known &nbsp;as a &quot;binary tree&quot; is used in distributed systems for efficient data verification. They are efficient because they use hashes instead of full files.&nbsp;

To put it simply, take three 16 digit numbers. Hash each one of them using a hashing algorithm like <strong>keccak256</strong>. These are now considered leaves on a Merkle Tree. Take those leaves, and link them together and you have a tree filled with leaves. Encoding the tree will result in a single alphanumeric output called a root ( Merkle Root ).

```js
let numbers = [ 1250125, 952195, 2955986 ]
let leaves = numbers.map(numbers => keccak256(numbers);
let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true}
=====================================================================

                               Hash1 [ABCD]
                                /         \
                           Hash2 [AB]    Hash3 [CD]

======================================================================
```

Without jumping too far into coding yet. We can see how an array of numbers when converted into leaves by hashing, then encoded by a Merkle Tree create a &quot;tree&quot; structure. Where each item is essentially linked together. The tree is all knowing of all it&#39;s leaves.

## Creating a Merkle Tree With Node

Now that we somewhat understand what a Merkle Tree is we can start to build one to better understand its use cases.

Let&#39;s start by spinning up a new Node project

```sh
touch index.js
npm init -y
npm i merkletreejs
npm i keccak256
```

That&#39;s all we&#39;ll need!

Next we can start creating a list of hex values to add to our tree

```js
const {MerkleTree} = require("merkletreejs")
const keccack256 = require("keccak256")

// List of addresses
let addresses = [
    '0x33039b066102dEb002313B8ee75514d5e16f161e',
    '0x80f4760E9309E60c7ef066827846B792AEeEAd57',
    '0x1B7C182AF1c1504AA2f95392720724a28a214B1C'
]
```

With our addresses in place we can now turn them into <em>leaves</em> by hashing them.

```js
// Hash our leaves
let leaves = addresses.map(addr = keccak256(addr))
```

Awesome, we have some leaves to assemble our tree with. Now let&#39;s finish up with our tree.

```js
// Create Tree
let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
let rootHash = merkleTree.getRoot().toString(&#39;hex&#39;)

// Print it out
console.log(merkleTree.toString())
console.log(&quot;Root Hash:&quot;, rootHash)

// Run with node index.js
> └─ 030ce4dccc57ba8af18fcc1e16523a167963dd25c4b3fd227b293cd7837bac23
   ├─ a41044c97488d3d3b3bca9d1140345bc904d70d40152f2eafb5d40427f798eef
   │  ├─ 0edf1f7db2bdb8874cf8f8b0b7c565839100e4129bbc08e652ab860d6ebe858b
   │  └─ f68fe227337e08d1dfe556724673c999fb398e8c31188ad2e331f4cba4bd1c0a
   └─ 8ccd02bcea47496fadaa9cd78f3795e6dcdd5063e456e611f076dd175967fb1f
      └─ 8ccd02bcea47496fadaa9cd78f3795e6dcdd5063e456e611f076dd175967fb1f

> Root Hash: 030ce4dccc57ba8af18fcc1e16523a167963dd25c4b3fd227b293cd7837bac23
```

Holy smokes! We just turned out leaves into a full grown tree!!

For real though. You can see from the console output that we&#39;ve converted a list of hex addresses into a linked (hashed ) binary tree. Additionally we&#39;ve output our root hash which is <strong><em>extremely&nbsp;</em></strong>important. Our root hash is how we can verify that one of our hex addresses is actually part of the tree! How you ask?

```js
// =====> Getting Proof
let address = address[0]
let hashedAddress = keccak256(address)
let proof = merkleTree.getHexProof(hashedAddress)
console.log(&quot;Merkle Proof&quot;, proof)

// Run with node index.js
> Merkle Proof [
  &#39;0xf68fe227337e08d1dfe556724673c999fb398e8c31188ad2e331f4cba4bd1c0a&#39;,
  &#39;0x8ccd02bcea47496fadaa9cd78f3795e6dcdd5063e456e611f076dd175967fb1f&#39;
]
```

Well.. we got our proof. Unfortunately it&#39;s not necessarily human readable. That Merkle Proof we have in our console output is merely cryptographic proof. Luckily however, we have utilities available to use to compare the Merkle Proof, the hashed address, and the Root Hash together to tell us if we&#39;re actually part of the tree!

```js
// Verify proof
let verified = merkleTree.verify(proof, hashedAddress, rootHash)
console.log(verified) // returns a Bool
```

Excellent! We&#39;ve sent our information into the verify function and have confirmed verification of proof that we are indeed cryptographically part of this tree.

## How is this used in the real world?

But where does all this leave us ? Well.. you&#39;re ready &nbsp;to use merkles in the real world. Merkle Trees are part of a large cryptographic family of systems of verification. They are used because they are efficient and we essentially only need our Root Hash and our Proof to determine if something is valid on our tree. This could be used as a checksum to determine if a file is part of a larger directory, or if an address is allowed to access parts of a smart contract.

To summarize what we've went over:
- We learned <strong>What a Merkle Tree is</strong>
- We learned <strong>How to create a Merkle Tree</strong>
- We learned <strong>How a Merkle Tree could be used<br></strong>

A sincere thank you if you&#39;ve made it this far. I enjoy writing these articles, even if it&#39;s only myself who uses them for reference. Until next time.