# Dockerize a Node API

## What is docker?

To keep it simple, Docker is an open-platform used for developing, running, and deploying applications in a containerized environment. Well what is a container you might ask. You can think of a container as a micro operating system that can be spun up
or down at whim. The container can host media, applications, utilities, or whatever else a typical operating system can run. Multiple containers can be run simultaneously, and via a network-bridge they can even communicate with each other and the host
operating system as well! In theory docker is much more, but to avoid being esoteric this is the general idea of Docker and containers.

## How can I use docker?

Docker can be used in many ways, but to keep it simple we&#39;ll focus on using it for creating application images that can be made portable to host virtually anywhere!

The docker CLI tool is the best way of getting started with becoming familiar with docker and it&#39;s abilities. All documentation can be found at docker&#39;s website [here](https://www.docker.com/).

Again this article is less about getting familiar with docker and more about using it for a controlled deployment cycle, so I&#39;ll skip the deep explanation and focus primarily on the use case. I will assume if you&#39;re reading this you have docker
installed and have used it at least a handful of times.

## Creating a simple application

We&#39;ll start of by putting together a fairly normal application. In this case we&#39;ll use JS for simplicity and create an API that returns a health check ( status 200 &quot;ok&quot; ).

I have my setup in the directory <em>/dev/health-check-api</em>. My <em>index.js</em> file is fairly plan but does the trick:

```js
var express = require("express");
var app = express();

app.get("/health", (req, res, next) => {
    res.json({"message": "ok"});
});

app.listen(5000, () => {
    console.log("Server running on port: 5000");
});
```

That&#39;s it! You can run the app to test it out ( you&#39;ll need to install express with npm, yarn, or pnpm first ). In theory it should return <em>{&quot;message&quot;: &quot;ok&quot;}</em> with a status code of `200` every time we visit `localhost:5000/health`.

## Time to dockerize

Now we can actually build our app inside a docker container. To do so you should have docker cli installed. Aside from the the first step is creating a docker file at the root of your project. `touch Dockerfile`.

The Dockerfile should look like this:

```docker
# We'll be using node alpine linux for this containers OS
FROM node:alpine as builder

# Change into the /app directory
WORKDIR /app

# Set our node environment
ENV NODE_ENV production

# Copy our package.json + lock and run npm install to build our deps
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

# Copy everything that was build into the root directory
COPY . .

# Run the app calling node on our index file
CMD [ "node", "index.js" ]
```

With this in place we can hit the last step of actually building an image using docker!

## Build our docker image

I know i didn&#39;t clarify to well what an &#39;image&#39; is. But just think of it as a pre-built container that we can save, commit, move, run, etc.. Now that we have everything we need let&#39;s put it all together. Using Docker CLI we can run a simple command to actually run the build.

<em>docker build --tag node-api .</em> - You should see a progress screen of the container being built and ultimately a success message.

You can view all of your images by running <em>docker images</em> which will output a list of images including your <em>node-api</em> image.

To run the image we can tell docker to simply run our image using: <em>docker run node-api</em>. You should see some output about the container starting up. Once it&#39;s built we can visit <em>localhost:5000/health</em> and see our output! That&#39;s it! You build a docker image and ran it as a container. This image can be sent to a container registry or run directly on a server alongside other docker containers!

## Summary

Today we&#39;ve put together quite a bit of development magic. We created a simple Node API, created a Docker image and ran it as an independent container. This is quite the feat! There&#39;s <strong>A LOT</strong> more that can be done with docker such as:
- Connecting multiple containers over a network bridge
- Orchestrating docker containers using Kubernetes
- Building a CI/CD flow to build the images, tag them and run them automatically

Let me know if this article helped you out, or if there are any ways I could improve. Thanks!