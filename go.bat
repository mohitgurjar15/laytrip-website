@ECHO OFF
REM Merge with master: https://stackoverflow.com/questions/34344034/git-pull-on-a-different-branch
REM git fetch origin master:master
REM git merge master

REM git fetch origin mohitSales_merge_withXavier
REM git merge origin/mohitSales_merge_withXavier

REM ng serve -o --watch --host 0.0.0.0 --disable-host-check
ng serve -o --host 0.0.0.0 --disable-host-check --watch --ssl --ssl-cert "D:\Users\Xavier Flix\Documents\LetsEncrypt\xfx.no-ip.org\fullchain.pem" --ssl-key "D:\Users\Xavier Flix\Documents\LetsEncrypt\xfx.no-ip.org\privkey.pem"