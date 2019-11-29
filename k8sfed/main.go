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
	if err := api.ConfigLoad(); err != nil {
		fmt.Print(err)
	} else {
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

		/*quit := make(chan os.Signal)
		signal.Notify(quit, os.Interrupt)
		<-quit

		log.Println("Shutdown Server ...")

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Fatal("Server Shutdown:", err)
		}
		log.Println("Server exiting")
		time.AfterFunc(5*time.Second, func() {
			fmt.Print("cancel!")
			cancel()
		})*/

	}
	/*r := api.RegisterHandlers()
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
	err = server.Serve(listen)*/

}
