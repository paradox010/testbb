#!/usr/bin/expect 

set timeout 10
set prompt daosheng@121.37.179.208
set password hzds0822@
set systemTime [clock seconds]
set date [clock format $systemTime -format %Y-%m-%d-%H:%M:%S]

set dir /data/daosheng/projects/product-knowledge-management_test/web

spawn ssh $prompt

expect {
  "(yes/no)? "
  {
    send "yes\n"
    expect "*password: " { send "$password\n"}
  }
  "*password: "
  {
    send "$password\n"
  }
}
expect {
  "*\\$ "
  {
    send "cd $dir&&ls \r"
    expect {
      "*\\$ " {
        send "mv dist dist$date \r"
      }
    }
  }
}
send "exit 0\r"
expect eof

spawn scp -r ./dist/ $prompt:$dir/
expect {
  "(yes/no)? "
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