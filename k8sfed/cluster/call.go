package cluster

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	_ "strings"
	"time"
)

var httpc *http.Client

func init() {
	/*tr := &http.Transport{
		//Dial:              dialTimeout,
		DisableKeepAlives: true,
		TLSClientConfig:   &tls.Config{InsecureSkipVerify: true},
		//MaxIdleConnsPerHost: 1,
	}
	//fmt.Printf("new http")
	httpc = &http.Client{
		Transport: tr,
		Timeout:   time.Duration(3) * time.Second,
	}*/
	httpc = createHTTPClient()

}
func dialTimeout(network, addr string) (net.Conn, error) {
	return net.DialTimeout(network, addr, time.Second*3)
}
func HTTPClient() *http.Client {
	//fmt.Printf("HTTPClient")
	/*tr := &http.Transport{
		Dial: func(network, addr string) (net.Conn, error) {
			return net.Dial(network, addr)
		},
		DisableKeepAlives: true,
	}

	return &http.Client{
		Transport: tr,
	}*/
	/*tr := &http.Transport{
		Dial: func(network, addr string) (net.Conn, error) {
			return net.Dial(network, addr)
		},
		Dial:              dialTimeout,
		DisableKeepAlives: true,
		TLSClientConfig:   &tls.Config{InsecureSkipVerify: true},
		//MaxIdleConnsPerHost: 1,
	}
	//fmt.Printf("new http")
	httpcc := &http.Client{
		Transport: tr,
		//Timeout:   time.Duration(1) * time.Second,
	}*/
	return httpc
}

const (
	MaxIdleConns        int = 1000
	MaxIdleConnsPerHost int = 1000
	IdleConnTimeout     int = 30
)

// createHTTPClient for connection re-use

func createHTTPClient() *http.Client {
	fmt.Println("create httpclient!")
	//client := http.DefaultClient{
	client := &http.Client{
		Transport: &http.Transport{
			Proxy: http.ProxyFromEnvironment,
			/*DialContext: (&net.Dialer{
				Timeout:   30 * time.Second,
				KeepAlive: 30 * time.Second,
			}).DialContext,*/
			DisableKeepAlives: true,
			Dial: (&net.Dialer{
				Timeout:   30 * time.Second,
				KeepAlive: 30 * time.Second,
			}).Dial,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 10 * time.Second,
			ExpectContinueTimeout: 1 * time.Second,

			TLSClientConfig:     &tls.Config{InsecureSkipVerify: true},
			MaxIdleConns:        MaxIdleConns,
			MaxIdleConnsPerHost: MaxIdleConnsPerHost,
			IdleConnTimeout:     time.Duration(IdleConnTimeout) * time.Second,
		},
		//Timeout: 20 * time.Second,
	}
	//client.Timeout = 10 * time.Second

	//fmt.Print(client.Transport)

	return client
}

/*
func Call(method, path, master string, data interface{}) (io.ReadCloser, int, error) {

	params := bytes.NewBuffer(nil)

	if data != nil {
		buf, err := json.Marshal(data)

		if err != nil {
			return nil, -1, err
		}

		if _, err := params.Write(buf); err != nil {
			return nil, -1, err
		}
	}

	req, err := http.NewRequest(method, path, params)

	if err != nil {
		return nil, -1, err
	}
	req.URL.Host = master
	req.URL.Scheme = "http"

	if data != nil {
		if method == "PATCH" {
			req.Header.Set("Content-Type", "application/strategic-merge-patch+json")
		} else {
			req.Header.Set("Content-Type", "application/json")
		}

	} else if method == "POST" {
		req.Header.Set("Content-Type", "application/text")
	}
	resp, err := HTTPClient().Do(req)

	if err != nil {
		return nil, -1, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, -1, err
		}

		if len(body) == 0 {
			return nil, resp.StatusCode, fmt.Errorf("Error: request returned %s, check if the server supports the requested API version",
				http.StatusText(resp.StatusCode))
		}

		return nil, resp.StatusCode, fmt.Errorf("Error response form daemon: %s", bytes.TrimSpace(body))
	}

	return resp.Body, resp.StatusCode, nil

}*/

func Call(method, path, master string, data interface{}) (io.ReadCloser, int, error) {
	//return nil, 0, fmt.Errorf("new error")
	//depsdata, _ := json.Marshal(httpc)
	//fmt.Print(depsdata)
	params := bytes.NewBuffer(nil)

	if data != nil {
		buf, err := json.Marshal(data)

		if err != nil {
			return nil, -1, err
		}

		if _, err := params.Write(buf); err != nil {
			return nil, -1, err
		}
	}
	var url = "http://" + master + path

	//timeout := time.Duration(10 * time.Second) //几秒后关闭
	//ctx, cancel = context.WithTimeout(context.Background(), timeout)

	req, err := http.NewRequest(method, url, params)

	//req = req.WithContext(ctx)
	/*time.AfterFunc(5*time.Second, func() {
		fmt.Print("cancel!")
		cancel()
	})*/

	if err != nil {
		return nil, -1, err
	}
	req.Close = true
	//req.URL.Host = master
	//req.URL.Scheme = "http"

	req.Header.Add("Connection", "close")

	//fmt.Print(req)
	if data != nil {
		if method == "PATCH" {
			req.Header.Add("Content-Type", "application/strategic-merge-patch+json")
		} else {
			req.Header.Add("Content-Type", "application/json")
		}

	} else if method == "POST" {
		req.Header.Add("Content-Type", "application/text")
	}
	HTTPClient().Timeout = 10 * time.Second

	resp, err := HTTPClient().Do(req)

	//fmt.Print(resp)
	if err != nil {
		return nil, -1, err
	}

	resp.Header.Add("Connection", "close")

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, -1, err
		}

		if len(body) == 0 {
			return nil, resp.StatusCode, fmt.Errorf("Error: request returned %s, check if the server supports the requested API version",
				http.StatusText(resp.StatusCode))
		}

		return nil, resp.StatusCode, fmt.Errorf("Error response form daemon: %s", bytes.TrimSpace(body))
	}

	return resp.Body, resp.StatusCode, nil

}

func ChartCall(method, path, master string, data io.Reader) (io.ReadCloser, int, error) {
	//return nil, 0, fmt.Errorf("new error")

	var url = "http://" + master + path

	//timeout := time.Duration(10 * time.Second) //几秒后关闭
	//ctx, cancel = context.WithTimeout(context.Background(), timeout)

	req, err := http.NewRequest(method, url, data)

	if err != nil {
		return nil, -1, err
	}
	req.Close = true
	//添加头
	req.Header.Add("Content-Type", "binary/octet-stream")

	if data != nil {
		if method == "PATCH" {
			req.Header.Add("Content-Type", "application/strategic-merge-patch+json")
		} else {
			req.Header.Add("Content-Type", "application/json")
		}

	} else if method == "POST" {
		//req.Header.Add("Content-Type", "application/text")
	}
	HTTPClient().Timeout = 10 * time.Second

	resp, err := HTTPClient().Do(req)

	//fmt.Print(resp)
	if err != nil {
		return nil, -1, err
	}

	resp.Header.Add("Connection", "close")

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, -1, err
		}

		if len(body) == 0 {
			return nil, resp.StatusCode, fmt.Errorf("Error: request returned %s, check if the server supports the requested API version",
				http.StatusText(resp.StatusCode))
		}

		return nil, resp.StatusCode, fmt.Errorf("Error response form daemon: %s", bytes.TrimSpace(body))
	}

	return resp.Body, resp.StatusCode, nil

}
func AuthCall(method, path, master string, data interface{}, username, password string) (io.ReadCloser, int, error) {

	params := bytes.NewBuffer(nil)

	if data != nil {
		buf, err := json.Marshal(data)

		if err != nil {
			return nil, -1, err
		}

		if _, err := params.Write(buf); err != nil {
			return nil, -1, err
		}
	}

	req, err := http.NewRequest(method, path, params)

	if err != nil {
		return nil, -1, err
	}
	req.SetBasicAuth(username, password)
	//fmt.Println(req)
	//username, ps, ok := req.BasicAuth()
	//fmt.Println("username ", username)
	//fmt.Println("ps ", ps)
	//fmt.Println("ok ", ok)

	req.URL.Host = master
	req.URL.Scheme = "https" //必须使用https
	req.Header.Set("Connection", "close")
	if method == "DELETE" {
		req.Header.Set("Accept", "application/json")
		req.Header.Set("X-Xsrftoken", "FrZ8jj0hgTOF5E127tGRXjZy0h1JmjRF")

	}

	//fmt.Print(req)
	if data != nil {
		if method == "PATCH" {
			req.Header.Set("Content-Type", "application/strategic-merge-patch+json")
		} else {
			req.Header.Set("Content-Type", "application/json")
		}

	} else if method == "POST" {
		req.Header.Set("Content-Type", "application/text")
	}
	resp, err := HTTPClient().Do(req)
	//fmt.Print(resp)
	if err != nil {
		return nil, -1, err
	}

	resp.Header.Set("Connection", "close")
	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, -1, err
		}

		if len(body) == 0 {
			return nil, resp.StatusCode, fmt.Errorf("Error: request returned %s, check if the server supports the requested API version",
				http.StatusText(resp.StatusCode))
		}

		return nil, resp.StatusCode, fmt.Errorf("Error response form daemon: %s", bytes.TrimSpace(body))
	}

	return resp.Body, resp.StatusCode, nil

}
func PatchCall(method, path, master string, data []byte) (io.ReadCloser, int, error) {

	params := bytes.NewBuffer(nil)

	if data != nil {
		if _, err := params.Write(data); err != nil {
			return nil, -1, err
		}
	}

	req, err := http.NewRequest(method, path, params)

	if err != nil {
		return nil, -1, err
	}
	req.URL.Host = master
	req.URL.Scheme = "http"

	if data != nil {
		if method == "PATCH" {
			req.Header.Set("Content-Type", "application/strategic-merge-patch+json")
		} else {
			req.Header.Set("Content-Type", "application/json")
		}

	} else if method == "POST" {
		req.Header.Set("Content-Type", "application/text")
	}
	resp, err := HTTPClient().Do(req)

	if err != nil {
		return nil, -1, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, -1, err
		}

		if len(body) == 0 {
			return nil, resp.StatusCode, fmt.Errorf("Error: request returned %s, check if the server supports the requested API version",
				http.StatusText(resp.StatusCode))
		}

		return nil, resp.StatusCode, fmt.Errorf("Error response form daemon: %s", bytes.TrimSpace(body))
	}

	return resp.Body, resp.StatusCode, nil

}

// func Stream(method, path, master string, stdout io.Writer, header map[string][]string) error {
// 	req, err := http.NewRequest(method, path, nil)
// 	req.URL.Host = master
// 	req.URL.Scheme = "http"
// 	if header != nil {
// 		for k, v := range header {
// 			req.Header[k] = v
// 		}
// 	}

// 	resp, err := HTTPClient(master).Do(req)
// 	defer resp.Body.Close()
// 	if err != nil {
// 		return err
// 	}

// 	StdCopy(stdout, resp.Body)
// 	return nil
// }

func Stream(method, path, master string) (io.ReadCloser, int, error) {
	req, err := http.NewRequest(method, path, nil)
	req.URL.Host = master
	req.URL.Scheme = "http"

	resp, err := HTTPClient().Do(req)

	if err != nil {
		return nil, -1, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, -1, err
		}

		if len(body) == 0 {
			return nil, resp.StatusCode, fmt.Errorf("Error: request returned %s, check if the server supports the requested API version",
				http.StatusText(resp.StatusCode))
		}

		return nil, resp.StatusCode, fmt.Errorf("Error response form daemon: %s", bytes.TrimSpace(body))
	}

	return resp.Body, resp.StatusCode, nil
}
