ssh $PIONEERSDEPLOYUSER@computerpionee.rs "\
  cd $PIONEERSPATH;\
  echo 'UPDATING SOURCE';\
  git pull origin master;\
  echo 'BUILDING TYPESCRIPT';\
  ./build.sh RUN=0;\
  echo 'RESTARTING APP SERVER';\
  sudo systemctl restart pioneers.service;\
  echo 'DONE'"
