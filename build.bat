
call npm run build


rmdir /s/q  %cd%\server_pro\public\static

call Xcopy %cd%\build  %cd%\server_pro\public /y /s

echo Íê³É
pause