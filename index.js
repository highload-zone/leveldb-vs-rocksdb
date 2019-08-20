"use strict";

const uuid = require("uuid/v4");
const rocksdb = require("level-rocksdb");
const leveldb = require("leveldown");
const Benchmarkify = require("benchmarkify");
const benchmark = new Benchmarkify("Pool benchmark").printHeader();

let generate = benchmark.createSuite("UUIDv4", {time: 10000});
let list = [], list2 = [], batch = [], batch2 = [], batch3 = [], batch4 = [], batch5 = [], batch6 = [];
generate.add("generate", () => list.push(uuid()));

let bench = benchmark.createSuite("RocksDB vs LevelDB put", {time: 2000, minSamples: 3});
const rdb = rocksdb("./rocksdb", {
    maxFileSize: 100 * 1024 * 1024
});
const ldb = leveldb("./leveldb");

bench.add("rocksdb put", done => rdb.put(list.pop(), 0, done));
bench.add("leveldb put", done => ldb.put(list2.pop(), 0, done));

const options = {time: 5000, minSamples: 3};

let bench2 = benchmark.createSuite("RocksDB vs LevelDB batch1000", options);
bench2.add("rocksdb batch 1000", done => rdb.batch(batch.pop(), done));
bench2.add("leveldb batch 1000", done => ldb.batch(batch2.pop(), done));

let bench3 = benchmark.createSuite("RocksDB vs LevelDB batch10000", options);
bench3.add("rocksdb batch 10000", done => rdb.batch(batch3.pop(), done));
bench3.add("leveldb batch 10000", done => ldb.batch(batch4.pop(), done));

let bench4 = benchmark.createSuite("RocksDB vs LevelDB batch100000", options);
bench4.add("rocksdb batch 100000", done => rdb.batch(batch5.pop(), done));
bench4.add("leveldb batch 100000", done => ldb.batch(batch6.pop(), done));

generate.run().then(() => {
    list2 = [...list];
    let size = list2.length;
    console.log("List size:", size);
    batch = partition([...list], 1000);
    batch2 = [...batch];
    let total1000 = batch2.length;
    batch3 = partition([...list], 10000);
    batch4 = [...batch3];
    let total10000 = batch4.length;
    batch5 = partition([...list], 100000);
    batch6 = [...batch5];
    let total100000 = batch6.length;
    console.log("Batch 1000 size:", total1000);
    console.log("Batch 10000 size:", total10000);
    console.log("Batch 100000 size:", total100000);
    ldb.open({
        maxFileSize: 100 * 1024 * 1024
    }, () => {
        benchmark.run([bench, bench2, bench3, bench4]).then(() => {
            console.log("RocksDB put saved:", size - list.length);
            console.log("LevelDB put saved:", size - list2.length);
            console.log("RocksDB batch1000 saved:", (total1000 - batch.length) * 1000);
            console.log("LevelDB batch1000 saved:", (total1000 - batch2.length) * 1000);
            console.log("RocksDB batch10000 saved:", (total10000 - batch3.length) * 10000);
            console.log("LevelDB batch10000 saved:", (total10000 - batch4.length) * 10000);
            console.log("RocksDB batch100000 saved:", (total100000 - batch5.length) * 100000);
            console.log("LevelDB batch100000 saved:", (total100000 - batch6.length) * 100000);
            rdb.close(() => {});
            ldb.close(() => {});
        });
    });
});

function partition(array, n) {
    return array.length ? [array.splice(0, n).map(key => ({
        type: "put",
        key,
        value: 0
    }))].concat(partition(array, n)) : [];
}