package namespace

import (
	"fmt"
	"io"
	"io/ioutil"
	"testing"
)

func TestNamespace(t *testing.T) {
	// meta := &Metadata{
	// 	Name: "test",
	// }
	// space := &Namespace{
	// 	Kind:       "Namespace",
	// 	ApiVersion: "v1",
	// 	Meta:       meta,
	// }

	space := &Namespaces{}
	body, statusCode, err := readBody(space.List("10.103.240.195:8080"))
	//body, statusCode, err := readBody(space.Delete("controller:8080"))
	//body, statusCode, err := readBody(space.Get("10.103.240.195:8080"))

	if err != nil {
		fmt.Printf("%v\n%v\n", statusCode, err)
	}

	fmt.Printf("%s\n", body)

}

func readBody(stream io.ReadCloser, statusCode int, err error) ([]byte, int, error) {
	if stream != nil {
		defer stream.Close()
	}

	if err != nil {
		return nil, statusCode, err
	}

	body, err := ioutil.ReadAll(stream)
	if err != nil {
		return nil, -1, err
	}

	return body, statusCode, nil

}
