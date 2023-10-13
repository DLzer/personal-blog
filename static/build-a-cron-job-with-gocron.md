# Build a CRON job with GoCron

## Introduction

Traditionally a cron is a [job scheduler](https://en.wikipedia.org/wiki/Job_scheduler) that allows the user to run &quot;jobs&quot; at specifically timed intervals. The most common application for creating cron-Jobs is scheduling repetitive tasks .</p><p>In this post we&#39;ll go over setting up a simple cron using the go-co-op/gocron package and logging a message to our log file. This sets up the ground work for adding actual jobs into the cron later down the line.

## Setup & Go

First things first let's set up our new project.
```sh
$ mkdir examplecron &amp;&amp; cd examplecron
```
Now that we have a project directory, create a <em>main.go</em> file in the root of that directory so we have a place to write our code.

As a personal preference, I create my <em>main.go</em> and then follow it with initializing go-mod
```sh
$ go mod init
```

After creating a <em>main.go</em> we need to install a reference to the <em>gocron</em> package to be able to use it in our project.

```sh
$ go get github.com/go-co-op/gocron
```

Now we can start writing some code. Let's begin by setting up our initial go project by declaring a package and initiating a main function

```go
package main

func main() {
}
```

Now create a function to simple print to console for now so we can test our progress so far. In this case I&#39;ll call the function <em>printOut</em> and it will take a single string as the parameter.</p>

```go
package main

import "fmt"

func printOut(msg string) {
    fmt.Println(msg)
}

func main() {
   printOut("Hello, world!")
}
```

Run the program!

```sh
$ go run main.go
>> Hello, world!
```

Nice, we haven&#39;t broken anything yet..
At last we can pull in gocron and create a cron job that can run out <em>printOut()</em> function for us on a schedule. I&#39;ll make note of each step below.

```go
package main

import (
    "fmt"
    "time"
    "github.com/go-co-op/gocron" // 1
)

func printOut(msg string) {
    fmt.Println(msg)
}

func runJobs() {
    s := gocron.NewScheduler(time.UTC) // 2
    
    s.Every(1).Minutes().Do(func() { // 3
        printOut("Hello, world!")  // 4
    }

    s.StartBlocking() // 5
}

func main() {
    runJobs() // 6
}
```

Alright! For simplicity I&#39;ve numbered the actions so I can describe them more in-depth below.

1. Here we import the gocron library for use in our code
2. We ask gocron to create a new scheduler. The <strong><em>s</em></strong> variable here will hold onto the scheduler so we can use it in the future to create our scheduled jobs. Into the scheduler we pass <em>time.UTC</em> which is a reference to <em>*time.Location</em> to tell the scheduler the time zone associated with our time.
3. We declare our cron task here. More specifically we tell our scheduler to do something every 1 minute.
4. This is where the execution lives, or the action we want our cron to perform within the interval we requested. In this case we want it to run our <em>printOut</em> function.
5. This line starts the scheduler in <em>non-blocking</em> mode which blocks the current execution path.
6. Here we&#39;ll execute our <em>runJobs&nbsp;</em>function which will start our cron.</li></ol><p>And that&#39;s it!</p><p>If we run our program at this point we should see &quot;Hello, World!&quot; print out every minute in our terminal.</p>

```sh
$ go run main.go
>> Hello, World!
>> Hello, World!
>> Hello, World!
```

We have successfully created and scheduled a cron job using Go and the gocron library! There are a handful other libraries to take into consideration, but this one has worked for me in many cases. Thanks for reading!