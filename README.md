# Benchmark leveldb vs rocksdb

```bash
$ npm start
> node index.js && du -d 1 -h | grep ".*db" && rm -rf *db

==================
  Pool benchmark  
==================

Platform info:
==============
   Linux 4.15.0-55-generic x64
   Node.JS: 12.6.0
   V8: 7.5.288.22-node.14
   Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz × 12

Suite: UUIDv4
✔ generate           548,859 rps

   generate            0%        (548,859 rps)   (avg: 1μs)
-----------------------------------------------------------------------

List size: 5489000
Batch 1000 size: 5489
Batch 10000 size: 549
Batch 100000 size: 55
Suite: RocksDB vs LevelDB put
✔ rocksdb put*           55,617 rps
✔ leveldb put*           75,225 rps

   rocksdb put*      -26.07%         (55,617 rps)   (avg: 17μs)
   leveldb put*           0%         (75,225 rps)   (avg: 13μs)
-----------------------------------------------------------------------

Suite: RocksDB vs LevelDB batch1000
✔ rocksdb batch 1000*              294 rps
✔ leveldb batch 1000*              420 rps

   rocksdb batch 1000*      -29.97%            (294 rps)   (avg: 3ms)
   leveldb batch 1000*           0%            (420 rps)   (avg: 2ms)
-----------------------------------------------------------------------

Suite: RocksDB vs LevelDB batch10000
✔ rocksdb batch 10000*               30 rps
✔ leveldb batch 10000*               40 rps

   rocksdb batch 10000*      -25.79%             (30 rps)   (avg: 33ms)
   leveldb batch 10000*           0%             (40 rps)   (avg: 25ms)
-----------------------------------------------------------------------

Suite: RocksDB vs LevelDB batch100000
✔ rocksdb batch 100000*                2 rps
✔ leveldb batch 100000*                4 rps

   rocksdb batch 100000*      -49.03%              (2 rps)   (avg: 443ms)
   leveldb batch 100000*           0%              (4 rps)   (avg: 225ms)
-----------------------------------------------------------------------

RocksDB put saved: 111231
LevelDB put saved: 150393
RocksDB batch1000 saved: 1473000
LevelDB batch1000 saved: 2103000
RocksDB batch10000 saved: 1500000
LevelDB batch10000 saved: 2010000
RocksDB batch100000 saved: 1200000
LevelDB batch100000 saved: 2400000
71M	./rocksdb
148M	./leveldb
```
