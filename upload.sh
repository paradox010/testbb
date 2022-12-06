#!/bin/bash

# random=$RANDOM
# echo $random
prompt=daosheng@121.37.179.208
password=hzds0822@
date=$(date "+%Y-%m-%d-%H:%M:%S")

expect <<-EOF
  set timeout 60

  spawn ssh $prompt
  expect {
    "(yes/no)?"
    {
      send "yes\n"
      expect "*password:" { send "$password\n"}
    }
    "*password: "
    {
      send "$password\n"
    }
  }
  expect {
    "*\\$ "
    {
      send "cd /data/daosheng/projects/product-knowledge-management_test/web&&ls \r"
      expect {
        "*\\$ " {
          send "mv dist dist$date \r"
        }
      }
    }
  }
  send "exit 0\r"

  expect eof

  spawn scp -r ./dist/ daosheng@121.37.179.208:/data/daosheng/projects/product-knowledge-management_test/web/
  expect {
    "(yes/no)?"
    {
      send "yes\n"
      expect "*password: " { send "$password\n"}
    }
    "*password: "
    {
      send "$password\n"
    }
  }
  expect eof
EOF
# 7777

