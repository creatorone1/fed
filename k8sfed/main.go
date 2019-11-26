package main

import (
	"fmt"
	"k8sfed/api"
	"net"
	"net/http"
	"time"
)

func main() {

	fmt.Printf("start server %v \n", time.Now())

	/*
		r := api.RegisterHandlers()
		mh := api.NewMiddleWareHandler(r)

		http.ListenAndServe(":9090", mh)
	*/
	r := api.RegisterHandlers()
	mh := api.NewMiddleWareHandler(r)
	server := &http.Server{
		Handler:      mh,
		ReadTimeout:  20 * time.Second,
		WriteTimeout: 20 * time.Second,
	}
	listen, err := net.Listen("tcp4", ":9090")
	if err != nil {
		fmt.Printf("Failed to listen,err:%s", err.Error())
		panic(err)
	}
	server.SetKeepAlivesEnabled(false)
	err = server.Serve(listen)
}
