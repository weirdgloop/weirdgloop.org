#!/bin/bash

set -e # halt script on error

bundle install --path=vendor
bundle exec jekyll build
bundle exec htmlproofer ./_site --disable-external