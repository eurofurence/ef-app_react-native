set dotenv-load

default:
	just --list

prebuild *ARGS:
	npx expo prebuild {{ARGS}}

switch-env NAME:
	#!/bin/bash
	if [ ! -f ./convention.config.{{NAME}}.json ]; then echo "Target environment '{{NAME}}' does not exist."; exit 1; fi
	cp ./convention.config.{{NAME}}.json ./convention.config.json
	echo "Switched to environment '{{NAME}}'."
