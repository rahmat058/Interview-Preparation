---
title: "MongoDB Interview Questions & Answers"
description: "15 essential MongoDB interview topics — documents, collections, indexes, aggregation, sharding, replication, and transactions."
tags: ["mongodb", "mern", "database", "nosql", "interview"]
level: "All levels"
---

# MongoDB Interview Questions & Answers

---

## Table of Contents

1. [What is MongoDB?](#1-what-is-mongodb)
2. [Features of MongoDB](#2-what-are-the-features-of-mongodb)
3. [SQL vs NoSQL](#3-what-is-the-difference-between-sql-and-nosql)
4. [Document in MongoDB](#4-what-is-a-document-in-mongodb)
5. [Collection in MongoDB](#5-what-is-a-collection-in-mongodb)
6. [insertOne vs insertMany](#6-what-is-the-difference-between-insertone-and-insertmany)
7. [ObjectId](#7-what-is-objectid)
8. [find vs findOne](#8-what-is-the-difference-between-find-and-findone)
9. [Indexes](#9-what-are-indexes-in-mongodb)
10. [Aggregation](#10-what-is-aggregation-in-mongodb)
11. [$match vs $filter](#11-what-is-the-difference-between-match-and-filter)
12. [Normalization vs Denormalization](#12-what-is-normalization-and-denormalization)
13. [Sharding](#13-what-is-sharding-in-mongodb)
14. [Replication](#14-what-is-replication-in-mongodb)
15. [Transactions](#15-how-does-mongodb-handle-transactions)

---

## 1. What is MongoDB?

### Theory

**MongoDB** is a document-oriented **NoSQL** database that stores data in flexible, JSON-like **BSON** documents instead of fixed tables and rows.

### Real Example

```javascript
// MERN — Mongoose model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("User", userSchema);
```

### Interview Answer

> MongoDB is a NoSQL document database storing flexible JSON-like documents in collections, ideal for rapid iteration and hierarchical data in MERN apps.

---

## 2. What are the features of MongoDB?

### Theory

| Feature            | Benefit                             |
| ------------------ | ----------------------------------- |
| Schema-less        | Evolve documents without migrations |
| Horizontal scaling | Sharding across clusters            |
| Rich queries       | Filtering, sorting, aggregation     |
| Indexing           | Fast lookups                        |
| Replication        | High availability                   |
| Geospatial         | Location-based queries              |

### Real Example

```javascript
// Flexible schema — add field without ALTER TABLE
await db.collection("products").insertOne({
  name: "Laptop",
  specs: { ram: "16GB", ports: ["USB-C", "HDMI"] }, // nested
  tags: ["electronics", "sale"],
});
```

### Interview Answer

> Key features are schema flexibility, horizontal scaling via sharding, replication for HA, powerful aggregation pipeline, and rich indexing — well suited for MERN backends.

---

## 3. What is the difference between SQL and NoSQL?

### Theory

|        | SQL (PostgreSQL, MySQL)        | NoSQL (MongoDB)                  |
| ------ | ------------------------------ | -------------------------------- |
| Model  | Tables, rows, columns          | Collections, documents           |
| Schema | Fixed, enforced                | Flexible                         |
| Joins  | Native JOINs                   | Embed or `$lookup`               |
| Scale  | Often vertical + read replicas | Horizontal sharding              |
| ACID   | Strong by default              | Multi-doc transactions since 4.0 |

### Real Example

```sql
-- SQL: users + orders with JOIN
SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id;
```

```javascript
// MongoDB: embedded orders (denormalized)
{
  name: "Rahul",
  orders: [{ id: 1, total: 499 }, { id: 2, total: 1299 }]
}
```

### Interview Answer

> SQL uses rigid tables and JOINs with strong relational modeling; MongoDB uses flexible documents and favors embedding or `$lookup` — choose SQL for complex relations, MongoDB for flexible schemas and scale-out.

---

## 4. What is a document in MongoDB?

### Theory

A **document** is the basic unit of data — a BSON object with field-value pairs, max **16 MB** per document.

### Real Example

```javascript
{
  _id: ObjectId("665f1a2b3c4d5e6f7a8b9c0d"),
  title: "MERN Tutorial",
  author: "Kazi",
  published: true,
  tags: ["react", "node"],
  metadata: { views: 1200, likes: 45 }
}
```

### Interview Answer

> A document is a single BSON record with key-value pairs — like a JSON object — and is the atomic unit stored in a collection.

---

## 5. What is a collection in MongoDB?

### Theory

A **collection** is a group of documents — analogous to a SQL **table**, but without enforced column structure.

### Real Example

```javascript
// Shell
use ecommerce;
db.products.insertOne({ name: "Phone", price: 29999 });
db.products.find({ price: { $lt: 50000 } });

// Mongoose — collection name pluralized: "products"
const Product = mongoose.model('Product', productSchema);
```

### Interview Answer

> A collection is a namespace holding related documents — similar to a table but schema-flexible across documents.

---

## 6. What is the difference between insertOne() and insertMany()?

### Theory

| Method         | Input              | Returns             |
| -------------- | ------------------ | ------------------- |
| `insertOne()`  | Single document    | `insertedId`        |
| `insertMany()` | Array of documents | `insertedIds` array |

### Real Example

```javascript
await db.collection("users").insertOne({ name: "Alice", email: "a@x.com" });

await db.collection("users").insertMany(
  [
    { name: "Bob", email: "b@x.com" },
    { name: "Carol", email: "c@x.com" },
  ],
  { ordered: false },
); // continue on duplicate error
```

### Interview Answer

> `insertOne` adds one document; `insertMany` bulk-inserts an array — use `ordered: false` to continue past individual failures.

---

## 7. What is ObjectId?

### Theory

**ObjectId** is MongoDB's default 12-byte `_id` type: 4-byte timestamp + machine + process + counter — **globally unique** without coordination.

### Real Example

```javascript
const { ObjectId } = require("mongodb");

const id = new ObjectId();
console.log(id.getTimestamp()); // creation time

await db
  .collection("posts")
  .findOne({ _id: new ObjectId("665f1a2b3c4d5e6f7a8b9c0d") });
```

### Interview Answer

> ObjectId is a 12-byte unique identifier often used as `_id`, embedding a timestamp — useful for sorting and distributed ID generation.

---

## 8. What is the difference between find() and findOne()?

### Theory

| Method      | Returns              | Use              |
| ----------- | -------------------- | ---------------- |
| `find()`    | Cursor (0+ docs)     | Lists, iteration |
| `findOne()` | Single doc or `null` | Unique lookup    |

### Real Example

```javascript
// All active users
const cursor = db
  .collection("users")
  .find({ active: true })
  .sort({ name: 1 })
  .limit(20);
const users = await cursor.toArray();

// Single user by email
const user = await db.collection("users").findOne({ email: "rahul@kpmg.com" });
```

### Interview Answer

> `find` returns a cursor for multiple documents; `findOne` returns the first match or null — use `findOne` for unique keys.

---

## 9. What are indexes in MongoDB?

### Theory

**Indexes** speed up queries by maintaining sorted data structures (B-tree). Without indexes, MongoDB does **collection scans**.

Common types: single field, compound, unique, text, geospatial.

### Real Example

```javascript
// Create indexes
await db.collection("orders").createIndex({ userId: 1, createdAt: -1 });
await db.collection("users").createIndex({ email: 1 }, { unique: true });

// Explain plan
const plan = await db
  .collection("orders")
  .find({ userId: "u123" })
  .explain("executionStats");
console.log(plan.executionStats.totalDocsExamined); // should be low
```

### Interview Answer

> Indexes are B-tree structures that avoid full collection scans — create compound indexes matching your query filter and sort patterns.

---

## 10. What is aggregation in MongoDB?

### Theory

The **aggregation pipeline** processes documents through stages: `$match`, `$group`, `$sort`, `$lookup`, `$project`, etc. — like SQL GROUP BY + JOIN chains.

### Real Example

```javascript
// Total revenue per category
const result = await db
  .collection("orders")
  .aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.category",
        totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ])
  .toArray();
```

### Interview Answer

> Aggregation is a multi-stage pipeline for transforming and summarizing data — `$match` filters early, `$group` aggregates, `$lookup` joins collections.

---

## 11. What is the difference between $match and $filter?

### Theory

| Operator  | Context          | Purpose                                   |
| --------- | ---------------- | ----------------------------------------- |
| `$match`  | Pipeline stage   | Filter **documents** (like WHERE)         |
| `$filter` | Array expression | Filter **elements inside an array** field |

### Real Example

```javascript
// $match — whole documents
db.orders.aggregate([{ $match: { status: "shipped", total: { $gte: 1000 } } }]);

// $filter — items inside one document
db.orders.aggregate([
  {
    $project: {
      orderId: 1,
      expensiveItems: {
        $filter: {
          input: "$items",
          as: "item",
          cond: { $gte: ["$$item.price", 500] },
        },
      },
    },
  },
]);
```

### Interview Answer

> `$match` filters documents at the pipeline level; `$filter` filters elements within an array field inside a `$project` or `$addFields` stage.

---

## 12. What is normalization and denormalization?

### Theory

|           | Normalization                 | Denormalization                |
| --------- | ----------------------------- | ------------------------------ |
| Idea      | Split data, avoid duplication | Duplicate/embed for read speed |
| MongoDB   | References (`userId`)         | Embedded subdocuments          |
| Trade-off | Consistent, more reads        | Faster reads, sync complexity  |

### Real Example

```javascript
// Normalized — reference
{ _id: 1, userId: ObjectId("..."), total: 499 }
// users collection separate

// Denormalized — embed author snapshot
{
  _id: 1,
  title: "Blog post",
  author: { id: ObjectId("..."), name: "Rahul", avatar: "url" }
}
```

### Interview Answer

> Normalize with references when data changes often and is shared; denormalize by embedding when read performance matters and duplication is acceptable.

---

## 13. What is sharding in MongoDB?

### Theory

**Sharding** horizontally partitions data across multiple servers using a **shard key**. The **mongos** router directs queries to the correct shard.

### Real Example

```javascript
// Shard key choice matters — avoid monotonic _id only on hot shard
sh.enableSharding("ecommerce");
sh.shardCollection("ecommerce.orders", { userId: 1, createdAt: 1 });
```

### Interview Answer

> Sharding distributes data across clusters by a shard key for horizontal scale — choose a high-cardinality key that spreads writes evenly.

---

## 14. What is replication in MongoDB?

### Theory

A **replica set** has one **primary** (writes) and **secondaries** (replicate oplog). Automatic failover elects new primary on failure.

### Real Example

```javascript
// Read from secondary for analytics (eventual consistency)
const client = new MongoClient(uri, {
  readPreference: ReadPreference.SECONDARY_PREFERRED,
});
```

### Interview Answer

> Replication copies data from primary to secondaries for high availability and read scaling — replica sets failover automatically when the primary dies.

---

## 15. How does MongoDB handle transactions?

### Theory

Since MongoDB 4.0, **multi-document ACID transactions** work on replica sets. Use `startSession` + `withTransaction` for all-or-nothing updates.

### Real Example

```javascript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    await accounts.updateOne(
      { _id: fromId },
      { $inc: { balance: -amount } },
      { session },
    );
    await accounts.updateOne(
      { _id: toId },
      { $inc: { balance: amount } },
      { session },
    );
  });
} finally {
  await session.endSession();
}
```

### Interview Answer

> MongoDB supports multi-document ACID transactions via sessions — use them when multiple collections must update atomically, like transfers or order + inventory.

---

**Next:** [02-expressjs-interview.md](./02-expressjs-interview.md)
