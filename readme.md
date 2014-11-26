# virtual-leveldown
Windows | Mac/Linux
------- | ---------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/virtual-leveldown.svg)](https://ci.appveyor.com/project/finnp/virtual-leveldown/branch/master) | [![Build Status](https://travis-ci.org/finnp/virtual-leveldown.svg?branch=master)](https://travis-ci.org/finnp/virtual-leveldown)

- on first read, read from actual backend
- on all subsequent reads, or any writes, only touch in-memory copy

TODO: Iterator