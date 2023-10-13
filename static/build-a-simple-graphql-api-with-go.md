# Build a simple GraphQL API with Go

## Introduction

The technical definition of <strong>GraphQL</strong> is: an open-source data manipulation and query language for APIs. It&#39;s also a runtime used for fulfilling graph queries with existing data. &nbsp;To simplify, <strong>GraphQL</strong> is both a query language, as well as a runtime environment that allows you to fulfill queries using the GraphQL syntax, while also creating shared-schemas between different services and applications.

In this module I hope to bridge the gap between transitioning from using a traditional REST-API to using GraphQL to provide data for our applications. This article itself acts as both an information resource and a training document for referencing.

## Prerequisites 

1. Go installation - Preferably >= 1.19
2. A basic knowledge and understanding of Go
3. A basic understanding of GraphQL, you can find in-depth tutorials on GraphQL [here](https://graphql.org/learn/)

## Setting up the project

Typically in the setup sections I would briefly go over creating an initial project directory. However, because we are using the [gqlgen](https://github.com/99designs/gqlgen) library to bootstrap our GraphQL server + schema there are a few extra steps I will document here.

First we&#39;ll start off by installing the primary gqlgen tool:
```sh
$ go install github.com/99designs/gqlgen@latest
```

Now we can create and initialize our typical Go project
```sh
$ mkdir gqlexample
$ cd gqlexample
$ go mod init gqlexample
```

Our project directory is now set up. We&#39;ll need to create a <em>tools.go</em> file to store our build tools

```sh
// +build tools

package tools

import _  "github.com/99designs/gqlgen"
```

Execute the tidy command to install dependencies

```sh
$ go mod tidy
```

Lastly for this section we will use the installed gqlgen tool to generate all the boilerplate files that are necessary for the GraphQL API

```sh
$ gqlgen init
```

The <em>gqlgen</em> command generates a <em>server.go</em> file that runs the actual GraphQL runtime server, as well as a /<em>graph</em> directory containing a <em>schema.graphqls</em> file which holds the schema definitions for our GraphQL API. In this project we won&#39;t necessarily have to interact with the server file. We will however be using the <em>schema.graphqls</em> file to define the models that we will be interacting with using GraphQL!

## GraphQL Schema Definition

In the first section we set up our project directory and using the <em>gqlgen</em> tool to generate some boilerplate files. In this section we&#39;ll be interacting with these files to define our schema. If you&#39;re new or only slightly familiar with GraphQL the next few steps may seem confusing, but I&#39;ll try to do my best to be esoteric with explaining.

To define our own schema we&#39;re going to open up the <em>schema.graphqls</em> file and drop in our own code. Considering this is module is meant to be an introduction to GraphQL we&#39;ll keep it simple with only creating a <strong>User</strong> model and functionality for creating/querying the user.</p><p>Open the <em>schema.graphqls</em> file and replace the code with the code below:

```go
//schema.graphqls

scalar Upload

type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
}

type Query {
    users: [User]!
}

input NewUser {
    name: String!
    email: String!
    createdAt: String
}

type Mutation {
    createUser(input: NewUser!): User!
}
```

OK, what did we do?<br><br>Gqlgen automatically defines the <strong>Upload</strong> scalar type, and the properties of a file. It&#39;s defined once at the top of the file.</p><p>We defined a <strong>User</strong> type which is the core data model of what our user will look like in our database and what our application will receive when querying for a full user.<br><br>Also defined is a <strong>Query</strong>. The query specifies when querying for <strong>users</strong> the server will expect the <strong>User</strong> type to be returned.<br><br>Our <strong>input</strong> is defined as <strong>NewUser</strong> meaning when creating a new user these are the fields expected to be present in the request body.<br><br></p><p>Finally we declared a <strong>Mutation</strong>. If you&#39;re not familiar with Mutations that&#39;s OK, the definition is in the name. It&#39;s meant to store functions that mutate or change the state of our database. In this case we defined a single function in our mutation called <strong>createUser</strong>, and you guessed it.. it creates a user. The <strong>createUser</strong> mutation accepts our <strong>NewUser</strong> input and returns a full <strong>User</strong> model!

## Generating Resolvers

In the previous step we modified our graph schema to define a few data models, a query, and a mutation for creating users. That&#39;s fantastic, but we still need a way for the outside world to interact with this functionality. Lucky for us <em>gqlgen</em> has thought about that and includes a tool to generate the resolvers based on our defined schema!<br><br>Run the following command to generate the resolvers:</p><pre>$ gqlgen generate</pre><p>Don&#39;t be afraid, but this command will probably do a few things. You may receive some validation errors, and you probably have a few new folders + files in your project. Don&#39;t worry if this looks complex, once you take a peek into each file the context is fairly idiomatic.

To resolve the validation errors simply delete the extraneous <strong><em>mutationResolvers </em></strong>gqlgen moved to the bottom of <em>schema.resolvers.go</em> these were sample functions and are no longer need ( they&#39;re also not modeled in our schema ) so we can easily remove them. While in this file also notice that we have functions related to our schema that have been generated!

- <strong>CreateUser</strong> &lt;- This is used to create a new user utilizing our <strong>User</strong> model
- <strong>User</strong> &lt;- Used to request/query our <strong>User</strong> model</p><p>I&#39;ll keep this section short because we did exactly what we intended on doing. We generated resolvers for our schema!

## Database Interactions

For the sake of the length of this already arduously long module I will <strong><em>not</em></strong> go into depth about how to set up a database connection in Go. I will cover this in another shorter module. However, In this section I will describe how to use a database connection in tandem with GraphQL.

It&#39;s recommended to create a <strong><em>db.go</em></strong> file under the <strong><em>graph</em></strong> directory. In this file we can specify a function that will automatically create the schema in our database!</p>

```go
package graph

import (
    //... Your database library
)

func createSchema(db *pg.DB) error {
    for _, models := range []interface{}{(*model.User)(nil)}{
        if err := db.Model(models).CreateTable(&orm.CreateTableOptions{
            IfNotExists: true,
        }); err != nil {
            panic(err)
        }
    }
    return nil
}
```

This function will create the tables in our database for us. Using <strong><em>IfNotExists</em></strong> is helpful in only creating the table if it doesn&#39;t already exist!

Below the <strong><em>createSchema&nbsp;</em></strong>function you should create a <strong><em>Connect</em></strong> function to actually connect to your database.

Now we&#39;re going to move into the <strong><em>server.go</em></strong> file to initialize our database and start GraphQL!</p><p>In this file we&#39;re going to replace the existing <strong><em>srv</em></strong> variable with our database handler:

```go
package main

import (
    ...
)

const defaultPort = "8080"

func main() {
    // ...

    Database := graph.Connect()
    srv := handler.NewDefaultServer(
        generated.NewExecutableSchema(
            generated.Config{
                Resolvers: &graph.Resolver{
                    DB: Database,
                },
            }),
        )

    // ...
}
```

Here we&#39;re essentially bootstrapping the database connection using the <strong><em>Connect</em></strong> function and starting call for the Resolver struct. The only issue is our Resolver struct doesn&#39;t contain a database connection. But we can quickly fix that by adding our db connection to the Resolver struct in <strong><em>resolver.go</em></strong>:

```go
package graph

import "your-database-driver"

type Resolver struct {
    DB *a.Db
}
```

Now your app has a database connection that can be established when the server.go is invoked and your app is started. At this point personally I&#39;m using <strong><em>go-pg</em></strong> which is dual used as an ORM so it&#39;s injected as well.

This section might have seemed a bit complicated, if not, awesome! Thankfully we&#39;re just about out of the weeds. In the last and final section we&#39;ll go over finishing the implementation of our resolvers that we left blank before. Then we can start querying!

## Implementing Resolvers

If you&#39;re familiar with building traditional REST-APIs in Go then you shouldn&#39;t have any problems with the following section. We&#39;re going to be filling out the functionality of the <strong><em>CreateUser&nbsp;</em></strong>and <strong><em>Users</em></strong> functions that were generated for us earlier.</p><p>Let&#39;s jump back into <strong><em>schema.resolvers.go</em></strong> and write some code!

```go
import (
    //...
    "github.com/google/uuid"
)

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
    user := model.User{
        ID:        fmt.Sprintf("%v", uuid.New()),
        Name:      input.Name,
        Email:     input.Email,
        CreatedAt: time.Now().Format("01-02-2003"),
    }

    _, err := r.DB.Model(&user).Insert(); if err != nil {
        return nil, fmt.Errorf("error inserting user: %v", err)
    }

    return &user, nil
}
```

In the mutation above we defined a few items. First, we accept our NewUser model as input and add a UUID ( I&#39;m using the google/uuid package ). I also added a timestamp for our created time. After that I&#39;m using the ORM to insert the new model into the database. Finally we handle any error from the response, if there are none we return the created user!</p><p>We can now run our app to test creating users. Start the app with:
```sh
$ go run ./server.go
```
If you navigate to the defined port on our local system you can access a build in GraphQL editor ( <strong><em>localhost:8080&nbsp;</em></strong>). You can paste the create mutation below to create a new user:

```go
mutation createUser{
    createUser(
        input: {
            email: "testemail@gmail.com"
            name: "Bilbo Baggins"
        }
    ) {
      id
    }
}
```

If you execute this mutation you &nbsp;should receive a response that contains a data key returning the id of your newly created user!

For the last step in this model we will implement the <strong><em>Users&nbsp;</em></strong>query resolver to be able to query our users from the database.</p><p>Head back to the <strong><em>schema.resolvers.go</em></strong> file and add the following code under the <strong><em>Users</em></strong> function:

```go
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
    var users []*model.User
    
    err := r.DB.Model(&users).Select()
    if err != nil {
        return nil, err
    }

    return users, nil
}
```

Theoretically you could expand the Select method to include clauses like <strong><em>LIMIT</em></strong> or <strong><em>WHERE</em></strong> to narrow the results. For this example we&#39;re just returning all users.

Head back to the browser and in our GraphQL sandbox enter the following query:

```go
query fetchUsers{
    users {
        name
        id
        email
    }
}
```

Your output should match the single user we created in the earlier step!</p><h2>Summary</h2><p>In this module we used the <strong><em>gqlgen</em></strong> library and created a Go project that defines a graph schema and mutations that we can use to interact with our GraphQL server using graph queries.

In future articles I&#39;ll go over more deployment methods like containerizing and deploying in a multitude of different ways.