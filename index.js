const neo4j = require('neo4j-driver').v1

const username = 'neo4j'
const password = 'XwJL9kB7WtoeJN8L'
const uri = 'bolt://35.202.130.217:7687'

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {disableLosslessIntegers: true})
var session = driver.session()

const query1 = "MATCH (p:Post)<-[:WROTE]-(u:User) RETURN p,u ORDER BY p.postId DESC"
const query2 = "MATCH (n:Movie) RETURN n LIMIT 10"

// fastest transaction time at 250ms, others were 300ms and 330ms
var tx = session.beginTransaction()

var transactionTime = new Date().getTime()
var data = []
tx.run(query2, {})
  .subscribe({
    onNext: function (record) {
      data.push(record._fields[0].properties)
    },
    onCompleted: function () {
      // console.log(data)
      session.close()
      driver.close()      
      console.log("transaction time: " + (new Date().getTime() - transactionTime) + "ms")
    },
    onError: function (error) {
      console.log(error)
    }
  })

