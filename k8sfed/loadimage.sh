#!/bin/bash 
#image_file example:  busybox:latest.tar
image_file=$1
echo "docker load image  $image_file"
loadstring=$(docker load -i ${image_file})
#loadstring:  Loaded image: gcr.io/google_containers/busybox:latest
#echo ${loadstring}

# imagename: busybox:latest
source_name=${loadstring#*image:}
# imagename: busybox:latest
image_name=${loadstring##*/}

docker tag $source_name $4/library/$image_name
echo "docker tag $source_name $4/library/$image_name"

docker login  $4 -u $2 -p $3
echo "docker push $4/library/$image_name"
push=$(docker push  $4/library/$image_name)
#echo $push
if [[ ${push} =~ "digest" ]];then
 echo "push done" 
else
 echo "push wrong"
fi
