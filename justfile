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

# Helpers for executing a command directly or via shell.
ASSERT_LINUX := if os_family() == "windows" { "wsl -- bash -ic '" } else { "" }
ASSERT_LINUX_END := if os_family() == "windows" { "'" } else { "" }

platform := 'android'
profile := 'preview'
build PLATFORM=platform PROFILE=profile:
    {{ASSERT_LINUX}} pnpm exec eas build --platform {{PLATFORM}} --profile {{PROFILE}} --local {{ASSERT_LINUX_END}}

cloud-build PLATFORM=platform PROFILE=profile:
    pnpm exec eas build --platform {{PLATFORM}} --profile {{PROFILE}}
cloud-submit PLATFORM=platform:
    pnpm exec eas submit --platform {{PLATFORM}}
