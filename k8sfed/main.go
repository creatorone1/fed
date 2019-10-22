package main

import (
	"fmt"
	"k8sfed/api"
	"net/http"
	"time"
)

func main() {

	fmt.Printf("start server %v \n", time.Now())

	r := api.RegisterHandlers()
	mh := api.NewMiddleWareHandler(r)
	http.ListenAndServe(":9090", mh)
}
