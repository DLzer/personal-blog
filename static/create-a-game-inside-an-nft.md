# Create a game inside of an NFT

You heard that right 🙃.

## Introduction

NFT's have been around for a while now, and since their inception they've come a long way in terms of functionality and popularity. I remember the early days of the ERC20 token standard, Defi yield-farming, and the first NFTs. This evolution has blown my mind every step of the way.

I knew pretty soon after hearing about the blockchain that I was already magnetized to the idea of creating some tpye of ethereal currency that can immutably live on a blockchain for.. eternity? 

I've been pretty lucky, and thankful, to have been part of some amazing teams and to have helped turn their blockchain ideas into full blown projects. This has lead me down a path I will not regret. Ok, enough about me.

## ZORK

Zork is a text-based adventure game that was developed in the year 1982. It was made for and played on some of the earliest computers.

For some reason I was drawn to this game, it was simple, yet so verbose. I knew immediately my goal was to recreate it in some modern language and host it for anyone to play.

So that's what I did. I spent a few days using Vanilla JS mapping all the rooms and items from the original game and got it quickly hosted online. Obviously as a developer you're never content with what you've built previously so it's gone through a couple iterations. But all in all I mostly finished Zork and it's available to player [here](https://dlzer.dev/projects/zork)!

## It's NFT Time

It was only a matter of time before I took one passion and combined it with another. At this point I've played with NFT's and their metadata enough to understand what the possibilities were, and although I've seen some amazing stuff done by people I had yet to see an actual game on token.

The first part of this was relatively simple. I knew I needed to move the static Zork application to a CDN so that I can serve it fast and efficiently.

![Zork on CDN](https://dlzer.dev/assets/zork-cdn.png "Zork On CDN")

I uploaded the content to a CDN storage spaces on Digital Ocean and messed around with some policies until I was able to visit the CDN link and run the game.

The code for the game is relatively straightforward as it's all static content and Vanilla JS based. You can check it out the codebase [here](https://github.com/dlzer/zork) to see what I'm talking about.

The next step was creating a generic ERC721A contract to generate tokens. That was pretty straightforward as well considering I have plenty of templates left over from other projects. This made bootstrapping easy.

Once I deployed the ERC721 ( NFT ) token the final thing to do was set the metadata pointing to my CDN. That way when the token shows up on a marketplace it will scrape the <em>metadata_uri</em> for the CDN url.

This is what the metadata looked like:

```json
{
    "description": "This is a test token for the ZORK project",
    "image": "https://zork.nyc3.cdn.digitaloceanspaces.com/zork.png",
    "animation_url": "https://zork.nyc3.cdn.digitaloceanspaces.com/index.html",
    "name": "Zork Token"
}
```

I generated 2 tokens to test it out, and when I opened OpenSea what do you know! There's ZORK, playable, inside of an NFT on OpenSea!!

![Zork on OpenSea](https://dlzer.dev/assets/zork-opensea.png "Zork On OpenSea")

## Conclusion

I know this was more wordy than technical, but in retrospect it was a pretty simple feat for something that I haven't seen much of before. My next steps are finding a away to preserve unique game data, and possibly even verify ownership so that no one else can play your game except the owner.

Until then remember, with grea power comes great responsibility 🧙

P.S. Happy Friday the 13th!

