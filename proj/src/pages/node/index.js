import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Divider,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import EditNode from './form/nodeedit'
import Header from './../../components/Header'
import utils from '../../utils/utils';
import cookie from 'react-cookies'

const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Node extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        cluster:[ 
            'Cluster1',
            'Cluster2'
        ],
        searchname:'',
        searchdata:[],
         dataSource:[
            {
                "name": "node1",
                "status": "Ready",
                "pods": [
                    "68",
                    "110"
                ],
                "role": "Master",
                "version": "v1.10.0",
                "cpu": [
                    "24",
                    "24"
                ],
                "memory": [
                    31.21,
                    31.31
                ],
                "cluster": "k8s-fed",
                "labels": [
                    {
                        "name": "beta.kubernetes.io/os",
                        "value": "linux"
                    },
                    {
                        "name": "kubernetes.io/hostname",
                        "value": "node1"
                    },
                    {
                        "name": "node-role.kubernetes.io/master"
                    },
                    {
                        "name": "beta.kubernetes.io/arch",
                        "value": "amd64"
                    }
                ],
                "ip": "10.103.240.130",
                "kubeletver": "v1.10.0",
                "kubeproxyver": "v1.10.0",
                "dockerver": "17.3.0",
                "os": "Ubuntu 16.04.2 LTS",
                "annotations": [
                    {
                        "name": "flannel.alpha.coreos.com/kube-subnet-manager",
                        "value": "true"
                    },
                    {
                        "name": "flannel.alpha.coreos.com/public-ip",
                        "value": "10.103.240.130"
                    },
                    {
                        "name": "node.alpha.kubernetes.io/ttl",
                        "value": "0"
                    },
                    {
                        "name": "volumes.kubernetes.io/controller-managed-attach-detach",
                        "value": "true"
                    },
                    {
                        "name": "flannel.alpha.coreos.com/backend-data",
                        "value": "{\"VtepMAC\":\"62:39:cf:53:eb:f8\"}"
                    },
                    {
                        "name": "flannel.alpha.coreos.com/backend-type",
                        "value": "vxlan"
                    }
                ],
                "images": [
                    {
                        "name": "tensorflow/tensorflow@sha256:847690afb29977920dbdbcf64a8669a2aaa0a202844fe80ea5cb524ede9f0a0b",
                        "size": 3361.08
                    },
                    {
                        "name": "<none>@<none>",
                        "size": 971.23
                    },
                    {
                        "name": "kubernetes/heapster@sha256:348a146015764736aabaae49cb51fc792f0358315aaeb6295a4b66b813477f81",
                        "size": 971.23
                    },
                    {
                        "name": "quay.io/coreos/hyperkube@sha256:699fc03fccb1c4662fee9d996cf30106aea55a6f594d16c1504cc7334dadcee4",
                        "size": 699.46
                    },
                    {
                        "name": "istio/examples-bookinfo-reviews-v3@sha256:8c0385f0ca799e655d8770b52cb4618ba54e8966a0734ab1aeb6e8b14e171a3b",
                        "size": 525.07
                    },
                    {
                        "name": "istio/examples-bookinfo-reviews-v1@sha256:920d46b3c526376b28b90d0e895ca7682d36132e6338301fcbcd567ef81bde05",
                        "size": 525.07
                    },
                    {
                        "name": "istio/examples-bookinfo-reviews-v2@sha256:d2483dcb235b27309680177726e4e86905d66e47facaf1d57ed590b2bf95c8ad",
                        "size": 525.07
                    },
                    {
                        "name": "mysql@sha256:7345ce4ce6f0c1771d01fa333b8edb2c606ca59d385f69575f8e3e2ec6695eee",
                        "size": 456.27
                    },
                    {
                        "name": "supernode:0.3.0",
                        "size": 429.85
                    },
                    {
                        "name": "xiaotech/fcp-amd64@sha256:8f925fd2af550bbe608a71a35b7b82aca996201699d5ae28753eec4a0c699079",
                        "size": 416.17
                    },
                    {
                        "name": "core.harbor.domain/library/mysql@sha256:1a34eeb78ca4e8043c771055319a21488bc2f9eaaab7b3ee5b2f6fba89215d5c",
                        "size": 384.53
                    },
                    {
                        "name": "istio/proxyv2@sha256:54e206530ba6ca9b3820254454e01b7592e9f986d27a5640b6c03704b3b68332",
                        "size": 370.63
                    },
                    {
                        "name": "bitnami/wordpress@sha256:7e9a6f08184ba1177ebb3e939216a41a4567bbda8c0cd98d56f9da26e85ec33b",
                        "size": 325.92
                    },
                    {
                        "name": "rancher/rancher-agent@sha256:1a9a966dc94933eab21534011f27114bfc769cbfeaff548f4fdde0967c66dd48",
                        "size": 322.48
                    },
                    {
                        "name": "istio/pilot@sha256:766482b916b8a3fb80aba05dc38c59c70c5e56bcc1750b582ad29cf05aee1cca",
                        "size": 308.02
                    },
                    {
                        "name": "grafana/grafana@sha256:9c86e0950726eb2d38dba6a0fa77e8757b76782a9a3cf56b65fcb689fcfd3b9e",
                        "size": 300.9
                    },
                    {
                        "name": "ranchercharts/grafana-grafana@sha256:15474e091da807e504a8425f656d82d380eca1bf2d11909dd25fd6622fc81dfb",
                        "size": 256.46
                    },
                    {
                        "name": "istio/examples-bookinfo-details-v1@sha256:73e1de909cd387cf377bb51ddd90167d0f44cf0659746d1d0e50276e8f1c9df3",
                        "size": 253.85
                    },
                    {
                        "name": "bitnami/dokuwiki@sha256:5c96d11b23e2c8109d6f2b20f496cb51611ec302bd59397d95506ceb532bf4af",
                        "size": 252.37
                    },
                    {
                        "name": "kubernetes/heapster_influxdb@sha256:24de37030e0da01c39b8863231b70f359e1fe6d4449505da03e2e7543bb068cb",
                        "size": 251.01
                    },
                    {
                        "name": "bitnami/kubeless-ui@sha256:e94bce1df20a15f517c4ef753acc90dbd3ee5e658faf4b8d703d17817b4da390",
                        "size": 231.34
                    },
                    {
                        "name": "gcr.io/google_containers/heapster_grafana@sha256:208c98b77d4e18ad7759c0958bf87d467a3243bf75b76f1240a577002e9de277",
                        "size": 230.09
                    },
                    {
                        "name": "k8s.gcr.io/kube-apiserver-amd64:v1.10.0",
                        "size": 225
                    },
                    {
                        "name": "istio/examples-bookinfo-ratings-v1@sha256:f84302e53e62a8a12510c7f8f437a7a34949be3dfb37f4eb9d054a76436fa4d7",
                        "size": 217.95
                    },
                    {
                        "name": "core.harbor.domain/library/kubernetes-bootcamp@sha256:34e5a47d302ee20039e5f0eb1e2f49785dafee3d97cac704befba6c1c7c938fc",
                        "size": 211.34
                    },
                    {
                        "name": "core.harbor.domain/library/kubernetes-bootcamp@sha256:84c0581141ceb7fcd3a51edace55e1d96fd9f6971c68d0269669045f4fa966fa",
                        "size": 211.34
                    },
                    {
                        "name": "registry.cn-hangzhou.aliyuncs.com/google_containers/nginx-ingress-controller@sha256:bd78b8d828156cc338b9f35b2e3a56a188724dbf117da376fb06ffad9ee17a70",
                        "size": 203.26
                    },
                    {
                        "name": "centos@sha256:6f6d986d425aeabdc3a02cb61c02abb2e78e57357e92417d6d58332856024faf",
                        "size": 199.72
                    },
                    {
                        "name": "k8s.gcr.io/etcd-amd64:3.1.12",
                        "size": 193.21
                    },
                    {
                        "name": "core.harbor.domain/library/etcd-amd64@sha256:258cbcd2303d5ca52b8e40f48bfe776dfd95fb43e580f9e70afd6df83c92992f",
                        "size": 193.21
                    },
                    {
                        "name": "anjia0532/etcd@sha256:1b6e3a9be8c5c45865c61bf6fe053ab38b3e0063cabbaa16011cf8dddb6ec22d",
                        "size": 192.74
                    },
                    {
                        "name": "goharbor/clair-photon@sha256:6c19b08c112b83937b6ba1d078d6507a8c80ad912f5769ac6e10937a076d1a10",
                        "size": 170.45
                    },
                    {
                        "name": "kubeless/python@sha256:7b3cb3c5ff9f2e1cccf22c4a8d6325f21f56fef51ce97c43444de5ff84af428d",
                        "size": 166.66
                    },
                    {
                        "name": "goharbor/harbor-core@sha256:bc491975633fb845e593f4d0637cdaff9620b51a1a2a7924c6780275005cda88",
                        "size": 155.48
                    },
                    {
                        "name": "goharbor/harbor-db@sha256:0fc09367feed82cdcc558823bd848752f155d65e52c245f1429d1a53915a4c1b",
                        "size": 148
                    },
                    {
                        "name": "k8s.gcr.io/kube-controller-manager-amd64:v1.10.0",
                        "size": 147.81
                    },
                    {
                        "name": "goharbor/notary-server-photon@sha256:88c8ee4d41b34f5b6984eb45b3c01ec4be0743db7b20564ec6e38a289b9c07ab",
                        "size": 145.83
                    },
                    {
                        "name": "istio/examples-bookinfo-productpage-v1@sha256:ed65a39f8b3ec5a7c7973c8e0861b89465998a0617bc0d0c76ce0a97080694a9",
                        "size": 143.98
                    },
                    {
                        "name": "goharbor/notary-signer-photon@sha256:343182129ea098c24f3856901e4bb0604c2ef833c09c1991508464a4bde37770",
                        "size": 142.83
                    },
                    {
                        "name": "goharbor/harbor-jobservice@sha256:4fbf1ea5553d61fd6cbf58b5db9a2dc44cc1ff3d2704902e920f79b76e3a17ce",
                        "size": 140.91
                    },
                    {
                        "name": "nvidia/cuda@sha256:764039ce9ff2cfb44d646fde6930099493334bb743e5b4f089d820de023c5d9a",
                        "size": 133.65
                    },
                    {
                        "name": "<none>@<none>",
                        "size": 133.5
                    },
                    {
                        "name": "quay.io/coreos/etcd-operator@sha256:cd2744797f18d85d8308da8783128830064b68cc61414f6ea369b75a256e488c",
                        "size": 133.5
                    },
                    {
                        "name": "rancher/rke-tools@sha256:b97b789d53eb42786c59d9910b893d9489933682f1d989fe5071d301a07041b1",
                        "size": 131.13
                    },
                    {
                        "name": "goharbor/chartmuseum-photon@sha256:f76094dd5f39a018619a52a447bc992325f19515956d337936d63eb29acb8696",
                        "size": 130.96
                    },
                    {
                        "name": "nginx@sha256:9916837e6b165e967e2beb5a586b1c980084d08eb3b3d7f79178a0c79426d880",
                        "size": 126.35
                    },
                    {
                        "name": "core.harbor.domain/library/nginx@sha256:bb3f89df82457706eff081803e89ce27611f1c75bfe72fab2e17e0aaa88d7c29",
                        "size": 126.32
                    },
                    {
                        "name": "core.harbor.domain/library/nginx@sha256:ec3b09634ad6b611e2e0969a3c0f2a66658ce5b1d3c18706442f0e54cf1d68f6",
                        "size": 126.22
                    },
                    {
                        "name": "nginx@sha256:77ebc94e0cec30b20f9056bac1066b09fbdc049401b71850922c63fc0cc1762e",
                        "size": 125.99
                    },
                    {
                        "name": "nginx@sha256:9688d0dae8812dd2437947b756393eb0779487e361aa2ffbc3a529dca61f102c",
                        "size": 125.98
                    }
                ],
                "conditions": [
                    {
                        "type": "OutOfDisk",
                        "status": "False",
                        "lastHeartbeatTime": "2019-12-16T07:09:24Z",
                        "lastTransitionTime": "2019-03-18T08:08:49Z",
                        "reason": "KubeletHasSufficientDisk",
                        "message": "kubelet has sufficient disk space available"
                    },
                    {
                        "type": "MemoryPressure",
                        "status": "False",
                        "lastHeartbeatTime": "2019-12-16T07:09:24Z",
                        "lastTransitionTime": "2019-03-18T08:08:49Z",
                        "reason": "KubeletHasSufficientMemory",
                        "message": "kubelet has sufficient memory available"
                    },
                    {
                        "type": "DiskPressure",
                        "status": "False",
                        "lastHeartbeatTime": "2019-12-16T07:09:24Z",
                        "lastTransitionTime": "2019-03-18T08:08:49Z",
                        "reason": "KubeletHasNoDiskPressure",
                        "message": "kubelet has no disk pressure"
                    },
                    {
                        "type": "PIDPressure",
                        "status": "False",
                        "lastHeartbeatTime": "2019-12-16T07:09:24Z",
                        "lastTransitionTime": "2019-03-18T08:08:49Z",
                        "reason": "KubeletHasSufficientPID",
                        "message": "kubelet has sufficient PID available"
                    },
                    {
                        "type": "Ready",
                        "status": "True",
                        "lastHeartbeatTime": "2019-12-16T07:09:24Z",
                        "lastTransitionTime": "2019-11-13T02:54:31Z",
                        "reason": "KubeletReady",
                        "message": "kubelet is posting ready status. AppArmor enabled"
                    }
                ],
                "nodeinfo": [
                    {
                        "name": "machineID",
                        "info": "0938485a05532909f758456b5b97bda2"
                    },
                    {
                        "name": "systemUUID",
                        "info": "4C4C4544-0056-5110-8031-B7C04F433732"
                    },
                    {
                        "name": "bootID",
                        "info": "9c20f7f2-57c4-4978-9509-49cbdc2f70ed"
                    },
                    {
                        "name": "kernelVersion",
                        "info": "4.4.0-135-generic"
                    },
                    {
                        "name": "osImage",
                        "info": "Ubuntu 16.04.2 LTS"
                    },
                    {
                        "name": "containerRuntimeVersion",
                        "info": "docker://17.3.0"
                    },
                    {
                        "name": "kubeletVersion",
                        "info": "v1.10.0"
                    },
                    {
                        "name": "kubeProxyVersion",
                        "info": "v1.10.0"
                    },
                    {
                        "name": "operatingSystem",
                        "info": "linux"
                    },
                    {
                        "name": "architecture",
                        "info": "amd64"
                    }
                ],
                "nodecomponentstatuses": {
                    "outofdisk": "True",
                    "diskpressure": "True",
                    "memorypressure": "True",
                    "kubelet": "True"
                }
            }
        , {
            "name": "controller",
            "status": "Ready",
            "pods": [
                "48",
                "110"
            ],
            "role": "Master",
            "version": "v1.10.0",
            "cpu": [
                "24",
                "24"
            ],
            "memory": [
                31.21,
                31.31
            ],
            "cluster": "controller",
            "labels": [
                {
                    "name": "kubernetes.io/hostname",
                    "value": "controller"
                },
                {
                    "name": "node-role.kubernetes.io/master"
                },
                {
                    "name": "a",
                    "value": "b"
                },
                {
                    "name": "beta.kubernetes.io/arch",
                    "value": "amd64"
                },
                {
                    "name": "beta.kubernetes.io/os",
                    "value": "linux"
                }
            ],
            "ip": "10.103.240.195",
            "kubeletver": "v1.10.0",
            "kubeproxyver": "v1.10.0",
            "dockerver": "18.3.0",
            "os": "Ubuntu 16.04.5 LTS",
            "annotations": [
                {
                    "name": "node.alpha.kubernetes.io/ttl",
                    "value": "0"
                },
                {
                    "name": "volumes.kubernetes.io/controller-managed-attach-detach",
                    "value": "true"
                },
                {
                    "name": "flannel.alpha.coreos.com/backend-data",
                    "value": "{\"VtepMAC\":\"86:8e:03:a9:5f:0d\"}"
                },
                {
                    "name": "flannel.alpha.coreos.com/backend-type",
                    "value": "vxlan"
                },
                {
                    "name": "flannel.alpha.coreos.com/kube-subnet-manager",
                    "value": "true"
                },
                {
                    "name": "flannel.alpha.coreos.com/public-ip",
                    "value": "10.103.240.195"
                }
            ],
            "images": [
                {
                    "name": "victorhcm/opencv:latest",
                    "size": 6455.84
                },
                {
                    "name": "kubernetes/heapster:canary",
                    "size": 971.23
                },
                {
                    "name": "controller:30005/synopsis:latest",
                    "size": 916.43
                },
                {
                    "name": "controller:30005/webssh:latest",
                    "size": 816
                },
                {
                    "name": "gcr.io/google_containers/fluentd-elasticsearch:1.17",
                    "size": 562.03
                },
                {
                    "name": "controller:30005/webconsole:latest",
                    "size": 559.11
                },
                {
                    "name": "tomcat:latest",
                    "size": 557.51
                },
                {
                    "name": "istio/examples-bookinfo-reviews-v3@sha256:8c0385f0ca799e655d8770b52cb4618ba54e8966a0734ab1aeb6e8b14e171a3b",
                    "size": 525.07
                },
                {
                    "name": "istio/examples-bookinfo-reviews-v2@sha256:d2483dcb235b27309680177726e4e86905d66e47facaf1d57ed590b2bf95c8ad",
                    "size": 525.07
                },
                {
                    "name": "istio/examples-bookinfo-reviews-v1@sha256:920d46b3c526376b28b90d0e895ca7682d36132e6338301fcbcd567ef81bde05",
                    "size": 525.07
                },
                {
                    "name": "mysql@sha256:b7f7479f0a2e7a3f4ce008329572f3497075dc000d8b89bac3134b0fb0288de8",
                    "size": 485.51
                },
                {
                    "name": "<none>@<none>",
                    "size": 444.76
                },
                {
                    "name": "gcr.io/google_containers/elasticsearch:1.8",
                    "size": 410.99
                },
                {
                    "name": "gcr.io/google_containers/elasticsearch:v2.4.1-1",
                    "size": 409.97
                },
                {
                    "name": "gcr.io/google_containers/kibana:1.3",
                    "size": 396.9
                },
                {
                    "name": "controller:30005/maccessserver:latest",
                    "size": 387.15
                },
                {
                    "name": "core.harbor.domain/library/mysql@sha256:1a34eeb78ca4e8043c771055319a21488bc2f9eaaab7b3ee5b2f6fba89215d5c",
                    "size": 384.53
                },
                {
                    "name": "maccessserver:v4.0.0",
                    "size": 378.89
                },
                {
                    "name": "istio/proxyv2@sha256:54e206530ba6ca9b3820254454e01b7592e9f986d27a5640b6c03704b3b68332",
                    "size": 370.63
                },
                {
                    "name": "bitnami/wordpress@sha256:1ebc8323c1ce385e50366e0303881653003e44603d3bfbf8748459242e3f3c00",
                    "size": 368.2
                },
                {
                    "name": "heketi/heketi:dev",
                    "size": 364.02
                },
                {
                    "name": "<none>@<none>",
                    "size": 363.8
                },
                {
                    "name": "heketi/heketi:latest",
                    "size": 361.59
                },
                {
                    "name": "kubeguide/tomcat-app:v1",
                    "size": 358.24
                },
                {
                    "name": "gluster/gluster-centos:latest",
                    "size": 346.3
                },
                {
                    "name": "<none>@<none>",
                    "size": 328.98
                },
                {
                    "name": "<none>@<none>",
                    "size": 328.98
                },
                {
                    "name": "bingchang/gluster:v2",
                    "size": 328.98
                },
                {
                    "name": "<none>@<none>",
                    "size": 328.98
                },
                {
                    "name": "bingchang/gluster:v1",
                    "size": 328.94
                },
                {
                    "name": "rancher/rancher-agent@sha256:1a9a966dc94933eab21534011f27114bfc769cbfeaff548f4fdde0967c66dd48",
                    "size": 322.48
                },
                {
                    "name": "hoolia/kubernetes-glusterfs-server:latest",
                    "size": 316.29
                },
                {
                    "name": "istio/pilot@sha256:766482b916b8a3fb80aba05dc38c59c70c5e56bcc1750b582ad29cf05aee1cca",
                    "size": 308.02
                },
                {
                    "name": "grafana/grafana@sha256:9c86e0950726eb2d38dba6a0fa77e8757b76782a9a3cf56b65fcb689fcfd3b9e",
                    "size": 300.9
                },
                {
                    "name": "bitnami/mariadb@sha256:3bb99b573f91755dc830f47f09bdc4af0d20ee2308ab68cb3aa5cdb660aa66a1",
                    "size": 298.71
                },
                {
                    "name": "gcr.io/google_containers/fluentd-elasticsearch:1.22",
                    "size": 266.24
                },
                {
                    "name": "istio/examples-bookinfo-details-v1@sha256:73e1de909cd387cf377bb51ddd90167d0f44cf0659746d1d0e50276e8f1c9df3",
                    "size": 253.85
                },
                {
                    "name": "kubernetes/heapster_influxdb:v0.5",
                    "size": 251.01
                },
                {
                    "name": "gcr.io/google_containers/kibana:v4.6.1-1",
                    "size": 238.8
                },
                {
                    "name": "bitnami/kubeless-ui@sha256:e94bce1df20a15f517c4ef753acc90dbd3ee5e658faf4b8d703d17817b4da390",
                    "size": 231.34
                },
                {
                    "name": "gcr.io/google_containers/heapster_grafana:v2.6.0-2",
                    "size": 230.09
                },
                {
                    "name": "k8s.gcr.io/kube-apiserver-amd64:v1.10.9",
                    "size": 228.07
                },
                {
                    "name": "k8s.gcr.io/kube-apiserver-amd64:v1.10.8",
                    "size": 228.07
                },
                {
                    "name": "k8s.gcr.io/kube-apiserver-amd64:v1.10.0",
                    "size": 225
                },
                {
                    "name": "127.0.0.1:30005/ubuntu:14.04",
                    "size": 221.96
                },
                {
                    "name": "k8s.gcr.io/etcd-amd64:3.2.18",
                    "size": 218.9
                },
                {
                    "name": "istio/examples-bookinfo-ratings-v1@sha256:f84302e53e62a8a12510c7f8f437a7a34949be3dfb37f4eb9d054a76436fa4d7",
                    "size": 217.95
                },
                {
                    "name": "core.harbor.domain/library/kubernetes-bootcamp@sha256:520432c28da38cd0d5c7d0a1da81bc69a99729738f4f696ad8ab65b9466d67b2",
                    "size": 211.34
                },
                {
                    "name": "core.harbor.domain/library/kubernetes-bootcamp@sha256:84c0581141ceb7fcd3a51edace55e1d96fd9f6971c68d0269669045f4fa966fa",
                    "size": 211.34
                },
                {
                    "name": "registry.cn-hangzhou.aliyuncs.com/google_containers/nginx-ingress-controller@sha256:bd78b8d828156cc338b9f35b2e3a56a188724dbf117da376fb06ffad9ee17a70",
                    "size": 203.26
                }
            ],
            "conditions": [
                {
                    "type": "OutOfDisk",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:43Z",
                    "lastTransitionTime": "2019-11-20T02:53:57Z",
                    "reason": "KubeletHasSufficientDisk",
                    "message": "kubelet has sufficient disk space available"
                },
                {
                    "type": "MemoryPressure",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:43Z",
                    "lastTransitionTime": "2019-11-20T02:53:57Z",
                    "reason": "KubeletHasSufficientMemory",
                    "message": "kubelet has sufficient memory available"
                },
                {
                    "type": "DiskPressure",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:43Z",
                    "lastTransitionTime": "2019-11-20T02:53:57Z",
                    "reason": "KubeletHasNoDiskPressure",
                    "message": "kubelet has no disk pressure"
                },
                {
                    "type": "PIDPressure",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:43Z",
                    "lastTransitionTime": "2019-11-20T02:53:57Z",
                    "reason": "KubeletHasSufficientPID",
                    "message": "kubelet has sufficient PID available"
                },
                {
                    "type": "Ready",
                    "status": "True",
                    "lastHeartbeatTime": "2019-12-16T07:05:43Z",
                    "lastTransitionTime": "2019-12-15T22:38:25Z",
                    "reason": "KubeletReady",
                    "message": "kubelet is posting ready status. AppArmor enabled"
                }
            ],
            "nodeinfo": [
                {
                    "name": "machineID",
                    "info": "702a6ce5f65ac75d01e6668d5789047c"
                },
                {
                    "name": "systemUUID",
                    "info": "4C4C4544-004D-5910-8057-C2C04F533732"
                },
                {
                    "name": "bootID",
                    "info": "c78ee535-6695-4dc9-8327-6fbf188d982a"
                },
                {
                    "name": "kernelVersion",
                    "info": "4.4.0-135-generic"
                },
                {
                    "name": "osImage",
                    "info": "Ubuntu 16.04.5 LTS"
                },
                {
                    "name": "containerRuntimeVersion",
                    "info": "docker://18.3.0"
                },
                {
                    "name": "kubeletVersion",
                    "info": "v1.10.0"
                },
                {
                    "name": "kubeProxyVersion",
                    "info": "v1.10.0"
                },
                {
                    "name": "operatingSystem",
                    "info": "linux"
                },
                {
                    "name": "architecture",
                    "info": "amd64"
                }
            ],
            "nodecomponentstatuses": {
                "outofdisk": "True",
                "diskpressure": "True",
                "memorypressure": "True",
                "kubelet": "True"
            }
        },
        {
            "name": "node2.bupt.edu.cn",
            "status": "Ready",
            "pods": [
                "3",
                "110"
            ],
            "role": "Worker",
            "version": "v1.10.0",
            "cpu": [
                "24",
                "24"
            ],
            "memory": [
                31.21,
                31.31
            ],
            "cluster": "controller",
            "labels": [
                {
                    "name": "beta.kubernetes.io/arch",
                    "value": "amd64"
                },
                {
                    "name": "beta.kubernetes.io/os",
                    "value": "linux"
                },
                {
                    "name": "kubernetes.io/hostname",
                    "value": "node2.bupt.edu.cn"
                },
                {
                    "name": "nodename",
                    "value": "node2"
                }
            ],
            "kubeletver": "v1.10.0",
            "kubeproxyver": "v1.10.0",
            "dockerver": "17.6.1",
            "os": "Ubuntu 16.04.5 LTS",
            "annotations": [
                {
                    "name": "node.alpha.kubernetes.io/ttl",
                    "value": "0"
                },
                {
                    "name": "volumes.kubernetes.io/controller-managed-attach-detach",
                    "value": "true"
                }
            ],
            "images": [
                {
                    "name": "rancher/server:stable",
                    "size": 1085.6
                },
                {
                    "name": "synopsis:v1",
                    "size": 868.99
                },
                {
                    "name": "controller:30005/live555:latest",
                    "size": 585.77
                },
                {
                    "name": "rancher/rancher:latest",
                    "size": 494.56
                },
                {
                    "name": "goharbor/harbor-db:v1.8.0",
                    "size": 140.39
                },
                {
                    "name": "goharbor/harbor-core:v1.8.0",
                    "size": 134.82
                },
                {
                    "name": "goharbor/harbor-jobservice:v1.8.0",
                    "size": 118.47
                },
                {
                    "name": "goharbor/chartmuseum-photon:v0.8.1-v1.8.0",
                    "size": 112.65
                },
                {
                    "name": "ubuntu:16.04",
                    "size": 112.44
                },
                {
                    "name": "goharbor/redis-photon:v1.8.0",
                    "size": 103.25
                },
                {
                    "name": "goharbor/harbor-registryctl:v1.8.0",
                    "size": 96.23
                },
                {
                    "name": "goharbor/harbor-log:v1.8.0",
                    "size": 81.46
                },
                {
                    "name": "goharbor/registry-photon:v2.7.1-patch-2819-v1.8.0",
                    "size": 81.3
                },
                {
                    "name": "goharbor/harbor-portal:v1.8.0",
                    "size": 42.88
                },
                {
                    "name": "goharbor/nginx-photon:v1.8.0",
                    "size": 35.96
                },
                {
                    "name": "quay.io/acaleph/rudder:v0.1.3",
                    "size": 22.51
                },
                {
                    "name": "k8s.gcr.io/pause-amd64:3.1",
                    "size": 0.74
                }
            ],
            "conditions": [
                {
                    "type": "OutOfDisk",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:47Z",
                    "lastTransitionTime": "2019-11-29T12:13:52Z",
                    "reason": "KubeletHasSufficientDisk",
                    "message": "kubelet has sufficient disk space available"
                },
                {
                    "type": "MemoryPressure",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:47Z",
                    "lastTransitionTime": "2019-11-29T12:13:52Z",
                    "reason": "KubeletHasSufficientMemory",
                    "message": "kubelet has sufficient memory available"
                },
                {
                    "type": "DiskPressure",
                    "status": "True",
                    "lastHeartbeatTime": "2019-12-16T07:05:47Z",
                    "lastTransitionTime": "2019-11-29T12:14:02Z",
                    "reason": "KubeletHasDiskPressure",
                    "message": "kubelet has disk pressure"
                },
                {
                    "type": "PIDPressure",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:47Z",
                    "lastTransitionTime": "2019-11-27T10:17:36Z",
                    "reason": "KubeletHasSufficientPID",
                    "message": "kubelet has sufficient PID available"
                },
                {
                    "type": "Ready",
                    "status": "False",
                    "lastHeartbeatTime": "2019-12-16T07:05:47Z",
                    "lastTransitionTime": "2019-11-29T12:13:52Z",
                    "reason": "KubeletNotReady",
                    "message": "runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:docker: network plugin is not ready: cni config uninitialized"
                }
            ],
            "nodeinfo": [
                {
                    "name": "machineID",
                    "info": "581523be8e423a44a08f48d756ff81ec"
                },
                {
                    "name": "systemUUID",
                    "info": "4C4C4544-0056-5010-8058-B7C04F423732"
                },
                {
                    "name": "bootID",
                    "info": "23a6ede2-31e3-4f53-a7e7-53d821ed650a"
                },
                {
                    "name": "kernelVersion",
                    "info": "4.4.0-135-generic"
                },
                {
                    "name": "osImage",
                    "info": "Ubuntu 16.04.5 LTS"
                },
                {
                    "name": "containerRuntimeVersion",
                    "info": "docker://17.6.1"
                },
                {
                    "name": "kubeletVersion",
                    "info": "v1.10.0"
                },
                {
                    "name": "kubeProxyVersion",
                    "info": "v1.10.0"
                },
                {
                    "name": "operatingSystem",
                    "info": "linux"
                },
                {
                    "name": "architecture",
                    "info": "amd64"
                }
            ],
            "nodecomponentstatuses": {
                "outofdisk": "True",
                "diskpressure": "False",
                "memorypressure": "True",
                "kubelet": "False"
            }
        },
        
         
        ], 
        alldatas:[] //所有集群下的node数据
        ,
        pauseop:false,
        currentcluster:'fed',
        btnloading:false, 
    }
    componentDidMount(){//请求数据
        //按集群读取节点数据
        this.request()
     }
    // 动态获取mock数据
    request = () => { //初始化数据请求
        fetch(utils.urlprefix+'/api/clusters',{
                method:'GET',
                headers: { 
                    "Authorization":"Basic "+cookie.load("at") 
                    },
            }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
            }).then((data) => {
                    console.log('data:',data)
                    this.setState({
                        cluster:data.filter(item=>item.status!="NotReady")
                    })

                fetch(utils.urlprefix+'/api/cluster/fed/namespaces',{
                        method:'GET',
                        headers: { 
                            "Authorization":"Basic "+cookie.load("at") 
                            },
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            console.log('data:',data)
                            var nms=[]
                            data.map(nm=>{
                                nms=nms.concat(nm.name)
                            })    
                            this.setState({
                                namespaces:nms,
                                fednamespaces:nms
                            })
                            
                            return data;
                        }).catch((e)=>{
                            console.log(e);
                        }) 

                    //请求节点数据
                    var nodes=[]
                    var clustercount=0  
                    var clength=  data.length
                    data.map(cluster=>{
                            fetch(utils.urlprefix+'/api/cluster/'+cluster.name+'/nodes',{
                        method:'GET',
                        mode: 'cors', 
                        headers: { 
                            "Authorization":"Basic "+cookie.load("at") 
                            },
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            console.log('data:',data)
                            clustercount++
                            nodes=nodes.concat(data)
                            if(clustercount==clength){
                                console.log('get all nodes') 
                                var nowdata=[]
                                if(this.state.currentcluster!='All'&& this.state.currentcluster!='fed'){
                                    nowdata=nodes.filter(item=>item.cluster==this.state.currentcluster)
                                    //console.log('get all nodes')
                                }else{
                                    nowdata=nodes
                                }
                                console.log('nowdata',nowdata)
                                this.setState({ //表格选中状态清空
                                    selectedRowKeys:[],
                                    selectedRows:null,
                                    dataSource: nowdata,
                                    alldatas:nodes,
                                    btnloading:false, 
                                })
                            }else{ 
                            } 
                            return data;
                        }).catch( (e)=> { 
                            console.log('getnode error:'+cluster.name+' '+e);
                            clustercount++ 
                            if(clustercount==clength){
                                var nowdata=[]
                                if(this.state.currentcluster!='All'&&this.state.currentcluster!='fed'){
                                    nowdata=nodes.filter(item=>item.cluster==this.state.currentcluster)
                                    console.log('Not All')
                                }else{
                                    console.log(' All')
                                    nowdata=nodes
                                }
                                console.log('nowdata2',nowdata)
                                this.setState({ //表格选中状态清空
                                    selectedRowKeys:[],
                                    selectedRows:null,
                                    dataSource: nowdata,
                                    alldatas:nodes, 
                                    btnloading:false, 
                                })
                            }else{ 
                            }
                            
                            })
                        })
                    return data;
                }).catch((e)=> {
                    this.setState({  
                        btnloading:false, 
                    })
                    console.log(e);
                })

         
    }  
    requestnode = (clustername) => { //初始化数据请求
     
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/nodes',{
                        method:'GET',
                        mode: 'cors',
                        headers: { 
                            "Authorization":"Basic "+cookie.load("at") 
                            }, 
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            console.log('data:',data)

                            this.setState({ //表格选中状态清空
                                selectedRowKeys:[],
                                selectedRows:null,
                                dataSource:data,
                            })
                            
                            return data;
                        }).catch( (e)=> {  
                            console.log(e);
                        })
                  

         
    }
    handleClustertChange=(value)=> {
        var data=[]
        if(value!='All'){
            data=this.state.alldatas.filter(item=>item.cluster==value)

        }else{
            data=this.state.alldatas 
        }
        
        this.setState({
            currentcluster:value ,
            dataSource:data
        })

        //进行筛选Clustert数据操作
        console.log(`cluster selected ${value}`);
    }
        //点击暂停
     handleMutiPause = ()=>{
            console.log("Pause")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'暂停节点',
                    content:'请选择一行',
                })
            } else  if(this.state.selectedRows.filter(item=>item.role=='Master').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'Master节点不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'暂停节点',
                content:'您确认要暂停这些节点吗？'+this.state.selectedRows.map(item=>item.name) ,
                onOk:()=>{
                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var depitem={
                            name:item.name ,
                            clustername:item.cluster
                        }
                        datas.items=datas.items.concat(depitem)
                    })
                    console.log('datas',JSON.stringify(datas))
                    fetch(utils.urlprefix+'/api/cluster/'+this.state.selectedRows[0].cluster+'/pause/nodes?data='+JSON.stringify(datas),{
                        method:'GET',
                        mode: 'cors', 
                        headers: { 
                            "Authorization":"Basic "+cookie.load("at") 
                            },
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('暂停成功');
                             
                            //刷新数据
                            this.request();
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('暂停失败');
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            console.log(e);
                        }) 
                     
                }
            })
     }
        //点击恢复
    handleMutiResume = ()=>{
            console.log("Resume")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'恢复节点',
                    content:'请选择一行',
                })
            }else if(this.state.selectedRows.filter(item=>item.role=='Master').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'Master节点不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'恢复节点',
                content:'您确认要恢复这些节点吗？'+this.state.selectedRows.map(item=>item.name) ,
                onOk:()=>{
                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var depitem={
                            name:item.name, 
                            clustername:item.cluster,
                        }
                        datas.items=datas.items.concat(depitem)
                    })
                    console.log('datas',JSON.stringify(datas))
                    fetch(utils.urlprefix+'/api/cluster/'+this.state.selectedRows[0].cluster+'/resume/nodes?data='+JSON.stringify(datas),{
                        method:'GET',
                        mode: 'cors', 
                         headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('恢复成功');
                            //刷新数据
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('恢复成功');
                           // message.error('恢复失败');
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            console.log(e);
                        }) 
                }
            })
        }  
        //点击驱逐
    handleMutiDrain = ()=>{
            console.log("Drain")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'驱逐节点',
                    content:'请选择一行',
                })
            }else if(this.state.selectedRows.filter(item=>item.role=='Master').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'Master节点不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'驱逐节点',
                content:'您确认要驱逐这些节点吗？'+this.state.selectedRows.map(item=>item.name),
                onOk:()=>{
                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var depitem={
                            name:item.name, 
                            clustername:item.cluster,
                        }
                        datas.items=datas.items.concat(depitem)
                    })
                    console.log('datas',datas)
                    
                    fetch(utils.urlprefix+'/api/cluster/'+this.state.selectedRows[0].cluster+'/drain/nodes?data='+JSON.stringify(datas),{
                        method:'GET',
                        mode: 'cors', 
                        headers: { 
                            "Authorization":"Basic "+cookie.load("at") 
                            },
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('驱逐成功');
                            //刷新数据
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('驱逐失败');
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            console.log(e);
                        }) 
                }
            })
        }         
    
     //下拉菜单item点击响应
     onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`);
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        //console.log( "key",key);
        //console.log( "text",text);
        //console.log( "item",record);
        if(key==='1'){ //如果是暂停
            this.handlePause(key, text, record)  
        }
        if(key==='2'){ //如果是驱逐
            this.handleDrain(key, text, record)
        }
        if(key==='3'){ //如果是编辑
            this.handleUpdate(true) //显示编辑对话框
            
        }
        if(key==='4'){ //如果是删除
            this.handleDelete(key, text, record)
        }
        if(key==='5'){ //如果是恢复
            this.handleResume(key, text, record)
        }
        
    }; 

     // 暂停操作
     handlePause = (key, text, record)=>{
        console.log("暂停！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
       
         Modal.confirm({
            title:'暂停节点',
            content:'您确认要暂停这节点吗？'+record.name,
            onOk:()=>{
                var datas={
                    items:[]
                }   
                var depitem={
                    name:record.name,
                    clustername:record.cluster
                }

                datas.items=datas.items.concat(depitem) 
                 console.log('datas',datas)
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/pause/nodes?data='+JSON.stringify(datas),{
                    method:'GET',
                    mode: 'cors',
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        }, 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('暂停成功');
                         
                        //刷新数据
                        //this.requestnode(this.state.currentcluster);
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('暂停失败');
                        //this.requestnode(this.state.currentcluster);
                        this.request();
                        console.log(e);
                    }) 
                 
            }
        }) 

    }

     // 驱逐操作
     handleDrain = (key, text, record)=>{
        console.log("驱逐！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'驱逐节点',
            content:'您确认要驱逐这节点吗？'+record.name,
            onOk:()=>{
                var datas={
                    items:[]
                }  
                
                 var depitem={
                     name:record.name,
                 }
                 datas.items=datas.items.concat(depitem)
                
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/drain/nodes?data='+JSON.stringify(datas),{
                    method:'GET',
                    mode: 'cors', 
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('驱逐成功');
                        //刷新数据
                        //this.requestnode(record.cluster);
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('驱逐失败');
                        //this.requestnode(record.cluster);
                        this.request();
                        console.log(e);
                    }) 
            }
        })
    }
      // 编辑操作
      handleUpdate = (visible)=>{
        //console.log("编辑！") 
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 

    }
     // 恢复操作
     handleResume = (key, text, record)=>{
        console.log("恢复！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'恢复节点',
            content:'您确认要恢复此节点吗？'+record.name ,
            onOk:()=>{
                var datas={
                    items:[]
                }  
                
                 var depitem={
                     name:record.name,
                     clustername:record.cluster
                } 
                datas.items=datas.items.concat(depitem) 
                
                 console.log('datas',datas)
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/resume/nodes?data='+JSON.stringify(datas),{
                    method:'GET',
                    mode: 'cors',
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        }, 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('恢复成功');
                        //刷新数据
                        //this.requestnode(record.cluster);
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('恢复失败');
                        //this.requestnode(record.cluster);
                        this.request();
                        console.log(e);
                    }) 
            }
        })
    }
    
    // 删除操作
    handleDelete = (key, text, record)=>{
        console.log("删除！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'删除节点',
            content:'您确认要删除此节点吗？'+record.name ,
            onOk:()=>{ 
                var datas={
                    items:[]
                }  
                var ditem={
                        name:record.name,  
                        clustername:record.cluster
                    } 
                datas.items=datas.items.concat(ditem) 
                    
                console.log('datas',JSON.stringify(datas))

               // console.log(JSON.stringify(datas))
                //下面URL的 集群 名称 以后需要替换掉 ok
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/nodes?data='+JSON.stringify(datas),{
                    method:'DELETE',
                    mode: 'cors', 
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request();
                        console.log(e);
                    }) 
                
            }
        })
    }
        //搜索输入框响应变化
    searchChange = (e)=>{
            //console.log('e.target.value',e.target.value)
            let content=e.target.value
            this.setState({
                searchname:content
            })
            if(content===''){
                this.setState({
                    search:false
                })    
            }
            if(content!==''){
                //console.log('this.state.searchname:',this.state.searchname)
                //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                this.setState({
                    searchdata:this.state.dataSource.filter(item=>item.name.indexOf(content)!==-1),
                    search:true
                })
                 
            }
        }
        //点击搜索按钮
    handleSearch = ()=>{
            //console.log('this.state.searchname:',this.state.searchname)
            if(this.state.searchname!==''){
                //console.log('this.state.searchname:',this.state.searchname)
                //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                this.setState({
                    searchdata:this.state.dataSource.filter(item=>item.name.indexOf(this.state.searchname)!==-1),
                    search:true
                })
                 
            }else{
                this.setState({ 
                    search:false
                })
                
            }
        }

    handleRedirect=(nodedetail)=>{
        console.log('跳转！')
        sessionStorage.setItem('nodename',nodedetail.name)
        sessionStorage.setItem('nodecluster',nodedetail.cluster)
         utils.nodedetail=nodedetail
    }

    statechange=()=>{ //创建服务之后回调
        console.log('refresh!')
        this.request()
    } 
    handleRefresh =() =>{
        console.log('refresh !')
        this.setState({ 
            btnloading:true
        })
        //this.request()
        setTimeout(()=> {//模拟数据加载结束则取消加载框 
            this.request()
        }
        ,1000) 
    } 
    render(){ 
        const columns=[
            {
                title:'节点名称',
                key:'name',
                dataIndex: 'name',
                render: (text,record) =>
                {
                    //<a href={"#/node/"+record.name}>{text}</a>      
                    return (  <Link to={"/node/detailpage/"+record.name}  onClick={()=>this.handleRedirect(record)}>{text}</Link>)
                }  
            },
            {
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(status){ //第一个是running中的pod 第二个是pod总数
                    let config = {
                        'Ready': <Tag  color="#87d068" style={{cursor:'auto' }} >Ready</Tag>,
                        'NotReady': <Tag  color="#ff7875" style={{cursor:'auto' }} >NotReady</Tag> ,  
                        'unschedulable': <Tag  color="#fa8c16" style={{cursor:'auto' }} >Unschedulable</Tag> ,  
                    
                    }
                    return config[status];
                }
               
            }, 
            {
                title:'所在集群',
                key:'cluster',
                dataIndex: 'cluster',
            },
            {
                title:'角色',
                key:'role',
                dataIndex: 'role',
            },
            {
                title:'版本',
                key:'version',
                dataIndex: 'version',
            },
            {
                title:'pods',
                key:'pods',
                dataIndex: 'pods',
                render(pods){ //第一个是running中的pod 第二个是pod总数
                    return(pods[0]+'/'+pods[1])
                }
            },
            {   
                title:'cpu',
                key:'cpu',
                dataIndex:'cpu',
                render(cpu){ //第一个是running中的pod 第二个是pod总数
                    return((cpu[1]-cpu[0]).toFixed(1)+'/'+cpu[1]+' Cores')
                }
                
            },
            {   
                title:'memory',
                key:'memory',
                dataIndex:'memory',
                render(memory){ //第一个是running中的pod 第二个是pod总数
                    return((memory[1]-memory[0]).toFixed(1)+'/'+memory[1]+' GB')
                }
            },
            {
                title:'操作',
                key:'operation', 
                render:(text,record)=>{
                    var opration
                    var pause= <Menu.Item key="1">暂停</Menu.Item>
                    var drain=<Menu.Item key="2">驱逐</Menu.Item>
                    var resume=<Menu.Item key="5">恢复</Menu.Item>
                    if(record.role=='Master'){
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                            <Menu.Item key="3">编辑</Menu.Item>
                          </Menu> 
                         } trigger={['click']}>
                             <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                        </Dropdown> )
                    } else{
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}>
                            {record.status=='unschedulable'?<Menu.Item key="5">恢复</Menu.Item>:''
                            }
                            {record.status=='Ready'?pause:''
                            }
                            {record.status=='Ready'?drain:''
                            }
                            <Menu.Item key="3">编辑</Menu.Item>
                            <Menu.Item key="4">删除</Menu.Item> 
                          </Menu> 
                         } trigger={['click']}>
                             <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                        </Dropdown> )
                    }
                    return opration
                }
            },

        ] 
        
        const selectedRowKeys=this.state.selectedRowKeys;
        const rowSelection={ 
            type: 'checkbox',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        } 
        const clusterdata=this.state.cluster.map( (item)=>( 
            <Option value={item.name} key={item.name}>{item.name}</Option>
         
            )
        )
        return (
            
            <div> 
                { this.state.loading?(  <Spin tip="Loading...">
                    <Alert
                    message="Loading"
                    description="数据加载中"
                    type="info"
                    />
                </Spin>
                ): 
            (  
            <div style={{ minHeight:'calc(60vh)'}}> 
                <div className="Dropdown-wrap"> 
                    <span style={{marginRight:10,fontSize:15}}>集群：</span>
                    <Select defaultValue='All' style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                         <Option value='All'  key='All'>全局</Option>
                          
                         {clusterdata}
                    </Select> 
                   
                </div>
               
               
               <div className="Dropdown-wrap" style={{marginTop:10}}> 
                    <span style={{marginRight:10,fontSize:15}}>节点列表 </span>  
                </div> 
                <div style={{backgroundColor:'white',marginTop:-10,padding:10 }}>
                    <Divider style={{marginTop:-5}}></Divider>
                    <Row className='Button-wrap' style={{ marginTop:-10}}> 
                    <Col span='16'> 
                        <Button onClick={this.handleMutiPause}>暂停<Icon type='pause'></Icon></Button>
                        <Button onClick={this.handleMutiResume}>恢复<Icon type="caret-right" /></Button>
                        <Button onClick={this.handleMutiDrain}>驱逐<Icon type="export" /></Button>
                         
                         
                        
                    </Col>
                        <Col span='8' className='Button-right'> 
                        <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    </Col>
                    </Row>
                    
                    <Spin tip="Loading..." spinning={this.state.btnloading}>
                    {this.state.btnloading?(      
                            <Alert
                                message="Loading"
                                description="数据加载中"
                                type="info"
                            />
                    ):
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowKey={record => record.name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                        /> }
                    </Spin>
                     
                </div>  
                <EditNode statechange={this.statechange} currentcluster={this.state.currentcluster} dataSource={this.state.operationdata}  editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></EditNode>
            </div>
                 )} 

            </div>
            
        )
    }
}