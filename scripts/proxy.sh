#!/bin/bash
cd `dirname $0`
node ../build/proxy/index.js | tee ../proxy.log
