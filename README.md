# Line Server
https://salsify.github.io/line-server.html

## Assumptions

* Each line is terminated with a newline ("\n").
* Any given line will fit into memory.
* The line is valid ASCII (e.g. not Unicode).
* The files can be as small as 1MB or as big as 100GB+.
* It should be scalable and handle mutiple clients.
* It should be a REST API.
  * 200 for success
  * 413 (!?!) for invalid line index.

## Libraries & Frameworks
### Express
I'm using express to have a more elegant mapping between routes and the actual implementation.

### Byline
This library allows me to have a read stream of a file and me to bind a event for each line of the file.

## Implementation
First and most importantly, this solution relies entirely on disk (don't run away just yet! :B).

For this to work, I'm using a tool called `split` to create chunks of 10.000 lines from a given file. This is of course a time-consuming proccess and in a ideal world we would have a mechanism in place that could do it faster after each file is uploaded. Using the `chunks` approach, it allows me to have a predicted response time and memory/CPU consumption regardless the size of the file. Therefore, the fastest response would be if you request the beginning of the chunk and the slowest as you progress to the end of the chunk. So the smaller the chunks faster would be the response time.

After creating the chunks inside of the `static/chunks/` folder the system creates a *map table* to have a in-memory link between `chunk range` and `file ` so when you request a `line-number` the system knows exactly which chunk to look inside.

After this, instead of adding the entire file into memory, `byline` streams smaller chunks of the shunk file, streams it and flush it after each chunk it consumed. This ensures minimal memory usage.

### Performance
#### Beginning of the chunk (best case scenario):
*** Memory: 60mb (idle) max: 250mb ***
```
Concurrency Level:      80
Time taken for tests:   1.473 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      246000 bytes
HTML transferred:       39000 bytes
Requests per second:    678.99 [#/sec] (mean)
Time per request:       117.822 [ms] (mean)
Time per request:       1.473 [ms] (mean, across all concurrent requests)
Transfer rate:          163.12 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   1.1      0       6
Processing:    14  114  17.6    114     165
Waiting:       12   95  16.6     97     148
Total:         20  115  17.2    114     165
```

#### Worst case scenario (end of chunk):
*** Memory: 60mb (idle) max: 130mb ***
```
Concurrency Level:      80
Time taken for tests:   13.134 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      292000 bytes
HTML transferred:       85000 bytes
Requests per second:    76.14 [#/sec] (mean)
Time per request:       1050.686 [ms] (mean)
Time per request:       13.134 [ms] (mean, across all concurrent requests)
Transfer rate:          21.71 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   1.2      0       7
Processing:   778 1031  82.5   1032    1331
Waiting:      778 1008  80.1   1013    1321
Total:        779 1031  82.8   1033    1331
```

### Possible improvements
1) In a real world case I would never use my own machine to store/process those chunks. I would do it directly on `Amazon S3 + CloudWatch Triggers` which would allow me to scale the chunks processing regardless of the amount of traffic that we may have and would also allow us to handle this way more faster.

2) Using Amazon S3 (or any storage as a service) would allow us to surpass the file system limitations regarding maximum open files (varies according to OS), space and also speed access to the chunks.

3) To make the application scale in terms of requests, we could just deploy the application using AWS `ECS + Fargate` in order to scale the number of containers we have running based on CPU usage, network traffic or any other metric we might see fit.

4) Since we are working only with one file it didn't cared much about how we store the chunks. To ensure faster access to the files regardless the amount of chunks we might have I would pick a different storage strategy which would be something like `chunks/$chunk_code/$filename` instead of throwing everything inside of the `chunks` folder.

5) I don't really like usage of the status code `413`. IMHO it can be improved. By defintion `/lines` is the resource and if I'm looking for a resource `/:line_number` that doesn't exist, the correct status should be `404 - Not Found` since it is an imutable file and this line will NEVER exist. The correct way to represent a resource that "existed" before but doens't exist anymore is the status code `410 - Gone` for example. The API Design could also be more extensible like `/files/:name/:line_number` which would allow me to serve multiple files and look for their files.

## Explored possibilities

### Database implementation
Probably fastest solution would be to create a model on a database where I could just insert each line of the file to a `table` and I could instantly have a relation between `line -> content`. Adding a index to the file, line column would allow me to to instant searches inside of a file regardless the amount of lines that I would need. I didn't used this because then it would be too obvious and it you woudn't have much code to review. The only problem I see with this solution is in case we achieve a super higher level of concurrency we could hit `active connection` limitations on this database. Use something like `DynamoDB` could also be an alternative to solve this.

### In-memory implementation
Working with memory is always faster but as always a very limited resource. It would allow me to work only with a very limited amount of files and the size of those files would also be very limited since a a file of 1GB would occupy way more than its fisical size after serialized and dumped into the applicatin memory.

## How to build it
```sh
./build.sh small.txt
```

## How to run it
```sh
./run.sh small.txt
```

## Running tests
```sh
docker-compose run --rm web npm run test
```

### If you are trying to make this all blow up, you might need to increase the OS max number if open files per process, on MacOS it is like this:
```sh
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536
```
