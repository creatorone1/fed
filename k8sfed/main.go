package main

import (
	"fmt"

	"net/http"
	"time"

	"k8sfed11.18/api"
)

func main() {

	fmt.Printf("start server %v \n", time.Now())

	r := api.RegisterHandlers()
	mh := api.NewMiddleWareHandler(r)
	http.ListenAndServe(":9090", mh)
}
