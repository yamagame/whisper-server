#!/bin/bash
cd `dirname $0`
node ./build/client/index.js | tee client.log
