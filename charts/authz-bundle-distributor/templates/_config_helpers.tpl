{{- define "authz-bundle-distributor.secretName" -}}
{{ template "authz-bundle-distributor.fullname" . }}-{{ .Release.Revision }}
{{ end -}}
{{- define "authz-bundle-distributor.shortname" -}}
{{ .Release.Name | trunc 18 | trimSuffix "-" }}-{{ sha256sum .Release.Name | trunc 5 }}
{{- end -}}
