package api

import (
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func homeHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	fmt.Println("Yes you in path: index.html")
	t, err := template.ParseFiles("./template/index.html") //main.go

	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}

func maniHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	t2, err := template.ParseFiles("./template/manifest.json") //main.go
	fmt.Println("Yes you in path: manifest.json")
	if err != nil {

		log.Println(err)
	}

	t2.Execute(w, nil)
}

func assetmaniHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	t3, err := template.ParseFiles("./template/asset-manifest.json") //main.go
	fmt.Println("Yes you in path: asset-manifest.json")
	if err != nil {

		log.Println(err)
	}

	t3.Execute(w, nil)
}
func serviceworkerHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	t4, err := template.ParseFiles("./template/service-worker.js") //main.go
	fmt.Println("Yes you in path: service-worker.js")
	if err != nil {

		log.Println(err)
	}

	t4.Execute(w, nil)
}
func iconHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	t5, err := template.ParseFiles("template/static/favicon.ico") //main.go
	fmt.Println("Yes you in path: favicon.ico")
	if err != nil {
		log.Println(err)
	}
	t5.Execute(w, nil)
}

func viewRouter(router *httprouter.Router) { 
	router.GET("/", homeHandler)
	router.POST("/", homeHandler)
	router.GET("/manifest.json", maniHandler)
	router.GET("/asset-manifest.json", assetmaniHandler)
	router.GET("/service-worker.js", serviceworkerHandler)
	router.ServeFiles("/static/*filepath", http.Dir("./template/static"))
	//router.Handler("GET", "/static/*filepath", http.StripPrefix("/static", http.FileServer(http.Dir("./template/static"))))
	//router.Handler("GET", "/doc/*filepath", http.StripPrefix("/doc", http.FileServer(http.Dir("./template/static"))))
	//router.ServeFiles("/doc/*filepath", http.Dir("./template/static"))
}
