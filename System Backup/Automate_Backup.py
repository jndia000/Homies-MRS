from datetime import date
from shutil import copyfile


date_backup = date.today()
print(date_backup)

str_date_backup = str(date_backup).replace('-','.')
print(str_date_backup)

path_input = r'C:\xampp\htdocs\medicalrecords\medicalrecord (1).sql'
path_output = r'C:\xampp\htdocs\medicalrecords\Backup Files' + '\\' + str_date_backup + ' - Backup Database.sql'
print(path_output)

copyfile(path_input,path_output)
