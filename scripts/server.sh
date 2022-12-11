#!/bin/bash
cd `dirname $0`
node ../build/server/index.js | tee ../serve.log
