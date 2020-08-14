{{- define "authz-bundle-distributor.standardLabels" -}}
{{ template "authz-bundle-distributor.staticLabels" . }}
{{ template "authz-bundle-distributor.dynamicLabels" . }}
{{- end -}}

{{- define "authz-bundle-distributor.staticLabels" -}}
{{ template "authz-bundle-distributor.selectorLabels" . }}
chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"
heritage: "{{ .Release.Service }}"
{{- end -}}

{{- define "authz-bundle-distributor.selectorLabels" -}}
app: {{ template "authz-bundle-distributor.name" . }}
release: "{{ .Release.Name }}"
{{- end -}}

{{- define "authz-bundle-distributor.dynamicLabels" -}}
releaseTime: "{{ .Release.Time.Seconds }}"
releaseRevision: "{{ .Release.Revision }}"
{{- if .Values.metadata }}
{{- range $key, $value := .Values.metadata }}
{{ $key }}: "{{ $value }}"
{{- end -}}
{{- end -}}
{{- end -}}
