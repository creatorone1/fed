package api

import (
	"encoding/json"
	"io"
	"net/http"
)

func sendErrorResponse(w http.ResponseWriter, errResp ErrResponse) {
	w.WriteHeader(errResp.HttpSC)

	resStr, _ := json.Marshal(&errResp.Error)
	io.WriteString(w, string(resStr))
}

// 调用方法
//sendNormalResponse(w, string(resp), 201)
func sendNormalResponse(w http.ResponseWriter, norResp NorResponse) {
	w.WriteHeader(norResp.HttpSC)
	resStr, _ := json.Marshal(&norResp.Normal)
	io.WriteString(w, string(resStr))
}
