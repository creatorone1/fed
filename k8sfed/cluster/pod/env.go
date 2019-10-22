package pod

type EnvRef struct {
	Name     string `json:"name,omitempty"`
	Optional bool   `json:"name,omitempty"`
}

type EnvFrom struct {
	Prefix       string  `json:"prefix,omitempty"`
	ConfigmapRef *EnvRef `json:"configMapRef,omitempty"`
	SecretRef    *EnvRef `json:"secretRef,omitempty"`
}

type FieldRef struct {
	ApiVersion string `json:"apiVersion,omitempty"`
	FieldPath  string `json:"fieldPath,omitempty"`
}

type ResourceFieldRef struct {
	ContainerName string `json:"containerName,omitempty"`
	Resource      string `json:"resourceomitempty"`
	divisor       string `json:"divisor,omitempty"`
}

type ConfigMapKeyRef struct {
	Name     string `json:"name,omitempty"`
	Key      string `json:"key,omitempty"`
	Optional bool   `json:"optional,omitempty"`
}

type SecretKeyRef struct {
	Name     string `json:"name,omitempty"`
	Key      string `json:"key,omitempty"`
	Optional bool   `json:"optional,omitempty"`
}

type ValueFrom struct {
	Field           *FieldRef         `json:"fieldRef,omitempty"`
	ResourceField   *ResourceFieldRef `json:"resourceFieldRef,omitempty"`
	ConfigMapKeyRef *ConfigMapKeyRef  `json:"configMapKeyRef,omitempty"`
	SecretKeyRef    *SecretKeyRef     `json:"secretKeyRef,omitempty"`
}

type Env struct {
	Name      string     `json:"name,omitempty"`
	Value     string     `json:"value,omitempty"`
	ValueFrom *ValueFrom `json:"valueFrom,omitempty"`
}
