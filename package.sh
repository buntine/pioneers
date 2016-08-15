sed 's/\#{\([^|}]\+\)\(|[^}]\+\)\?}/\1/g' data/csv/achievements.csv > achievements.csv
zip data/dist/pioneers.zip achievements.csv data/csv/people.csv data/csv/awards.csv
rm achievements.csv
