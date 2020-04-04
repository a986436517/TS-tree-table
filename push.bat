echo 开始添加变更

echo;
git add -A 
echo 执行结束！

echo;
echo 提交变更到本地仓库
set /p declation=输入修改:
git commit -m "%declation%"

echo;
echo 将变更情况提交到远程git服务器
git push origin dev

echo;
echo 批处理执行完毕！
echo;

pause